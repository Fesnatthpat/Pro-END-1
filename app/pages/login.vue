<template>
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        <div class="p-8 sm:p-10">
            <div class="text-center mb-8">
                <NuxtLink to="/"
                    class="inline-flex items-center gap-2 text-3xl font-extrabold mb-3 hover:scale-105 transition-transform duration-300">
                    <div class="w-10 h-10 bg-blue-600 rounded-xl shadow-md flex justify-center items-center">
                        <span class="text-white font-bold text-xl">CS</span>
                    </div>
                    <span class="text-gray-900 tracking-tight">PROJECT</span>
                </NuxtLink>
                <h2 class="text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
                <p class="text-sm text-gray-500 mt-2">ระบบบริหารจัดการโครงงานคอมพิวเตอร์</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">

                <div v-if="errorMessage"
                    class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ errorMessage }}
                </div>

                <div class="space-y-1">
                    <label class="block text-sm font-semibold text-gray-700">อีเมล (Email)</label>
                    <input v-model="email" type="email" required placeholder="student@bsru.ac.th"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 disabled:opacity-50"
                        :disabled="isLoading" />
                </div>

                <div class="space-y-1">
                    <div class="flex items-center justify-between">
                        <label class="block text-sm font-semibold text-gray-700">รหัสผ่าน (Password)</label>
                        <a href="#"
                            class="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">ลืมรหัสผ่าน?</a>
                    </div>
                    <input v-model="password" type="password" required placeholder="••••••••"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 disabled:opacity-50"
                        :disabled="isLoading" />
                </div>

                <div class="flex items-center">
                    <label class="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                        <input type="checkbox"
                            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors" />
                        จดจำการเข้าสู่ระบบไว้
                    </label>
                </div>

                <button type="submit" :disabled="isLoading"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2">
                    <span v-if="isLoading"
                        class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {{ isLoading ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบ' }}
                </button>

            </form>
        </div>

        <div class="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
            <NuxtLink to="/"
                class="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับไปหน้าแรก
            </NuxtLink>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'login' })

// 1. ประกาศใช้ Cookie (ตั้งชื่อว่า 'user_data')
const userCookie = useCookie('user_data', {
    maxAge: 60 * 60 * 24 * 7, // เก็บไว้ 7 วัน
    path: '/',
    watch: true
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    try {
        isLoading.value = true
        errorMessage.value = ''

        // สั่งให้หน้าบ้าน (Frontend) วิ่งไปถามหลังบ้าน (API Prisma) ที่เราสร้างไว้
        const response = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        })

        // ถ้าหลังบ้านตอบกลับมาว่ารหัสถูก ให้บันทึก Cookie และเช็ค Role
        if (response && response.user) {
            // บันทึกข้อมูลผู้ใช้ลงใน Cookie
            userCookie.value = {
                id: response.user.id,
                email: response.user.email,
                firstName: response.user.firstName,
                role: response.user.role
            }

            const role = response.user.role
            if (role === 'ADMIN') {
                return navigateTo('/admin/dashboard')
            } else if (role === 'STUDENT') {
                return navigateTo('/student/dashboard')
            } else if (role === 'ADVISOR') {
                return navigateTo('/advisor/dashboard')
            }
        }

    } catch (error) {
        // ถ้ารหัสผิด ให้เอาข้อความจากหลังบ้านมาแสดง
        errorMessage.value = error.data?.statusMessage || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองใหม่อีกครั้ง'
    } finally {
        isLoading.value = false
    }
}
</script>