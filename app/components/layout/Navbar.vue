<template>
    <nav class="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">

            <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
                <div class="w-8 h-8 bg-blue-600  rounded-md flex items-center justify-center">
                    <span class=" font-bold text-white">CS</span>
                </div>
                <span class="text-gray-900"><span
                        class="text-gray-600 underline decoration-2 underline-offset-4">PROJECT</span></span>
            </NuxtLink>

            <ul class="hidden lg:flex space-x-8 text-gray-700 font-medium">
                <li>
                    <NuxtLink to="/" class="hover:text-blue-600 transition-colors">หน้าแรก</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/projects" class="hover:text-blue-600 transition-colors">โครงงานทั้งหมด</NuxtLink>
                </li>
                <li v-if="user?.role === 'STUDENT'">
                    <NuxtLink to="/student/dashboard" class="hover:text-blue-600 transition-colors">จัดการโครงงาน</NuxtLink>
                </li>
                <li v-if="user?.role === 'ADVISOR'">
                    <NuxtLink to="/advisor/dashboard" class="hover:text-blue-600 transition-colors">แดชบอร์ดอาจารย์</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/status" class="hover:text-blue-600 transition-colors">เช็คสถานะ</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact" class="hover:text-blue-600 transition-colors">ติดต่อเรา</NuxtLink>
                </li>
            </ul>

            <div class="hidden lg:flex items-center gap-4">
                <template v-if="user">
                    <div class="flex items-center gap-3 pr-4 border-r border-gray-200">
                        <div
                            class="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-blue-50">
                            {{ user.firstName?.charAt(0) }}
                        </div>
                        <div class="text-sm">
                            <p class="font-bold text-gray-900 leading-none">{{ user.firstName }}</p>
                            <p class="text-[10px] font-medium text-blue-600 mt-1 uppercase tracking-wider">{{ user.role }}
                            </p>
                        </div>
                    </div>
                    <button @click="handleLogout"
                        class="flex items-center gap-1.5 text-gray-500 hover:text-red-600 font-medium text-sm transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        ออกจากระบบ
                    </button>
                </template>
                <NuxtLink v-else to="/login"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6 py-2 transition-colors shadow-md hover:shadow-lg">
                    เข้าสู่ระบบ
                </NuxtLink>
            </div>

            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </div>

        <div v-if="isMobileMenuOpen"
            class="lg:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-md">
            <NuxtLink to="/" class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                หน้าแรก</NuxtLink>
            <NuxtLink to="/projects"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">โครงงานทั้งหมด
            </NuxtLink>
            <NuxtLink v-if="user?.role === 'STUDENT'" to="/student/dashboard"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">จัดการโครงงาน
            </NuxtLink>
            <NuxtLink v-if="user?.role === 'ADVISOR'" to="/advisor/dashboard"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">แดชบอร์ดอาจารย์
            </NuxtLink>
            <NuxtLink to="/status"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">เช็คสถานะ
            </NuxtLink>
            <NuxtLink to="/contact"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">ติดต่อเรา
            </NuxtLink>

            <div v-if="user" class="pt-4 border-t border-gray-100 space-y-2">
                <div class="px-3 py-2 flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {{ user.firstName?.charAt(0) }}
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">{{ user.firstName }}</p>
                        <p class="text-xs text-gray-500 uppercase">{{ user.role }}</p>
                    </div>
                </div>
                <button @click="handleLogout"
                    class="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md">
                    ออกจากระบบ
                </button>
            </div>
            <NuxtLink v-else to="/login"
                class="block px-3 py-2 mt-4 text-center bg-blue-600 text-white rounded-md font-medium">เข้าสู่ระบบ
            </NuxtLink>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue'

const isMobileMenuOpen = ref(false)

// ดึงคุกกี้มาเช็คสถานะ
const userCookie = useCookie('user_data')
const user = computed(() => userCookie.value)

const handleLogout = () => {
    userCookie.value = null
    isMobileMenuOpen.value = false
    return navigateTo('/login')
}
</script>
