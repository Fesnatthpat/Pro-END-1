<template>
    <nav class="bg-white border-b border-gray-100 shadow-sm">
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
                <li>
                    <NuxtLink to="/status" class="hover:text-blue-600 transition-colors">เช็คสถานะ</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact" class="hover:text-blue-600 transition-colors">ติดต่อเรา</NuxtLink>
                </li>
            </ul>

            <div class="hidden lg:block">
                <NuxtLink to="/login"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6 py-2 transition-colors">
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
            <NuxtLink to="/status"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">เช็คสถานะ
            </NuxtLink>
            <NuxtLink to="/contact"
                class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">ติดต่อเรา
            </NuxtLink>
            <NuxtLink to="/login"
                class="block px-3 py-2 mt-4 text-center bg-blue-600 text-white rounded-md font-medium">เข้าสู่ระบบ
            </NuxtLink>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'

// ตัวแปรสำหรับเปิด/ปิดเมนูในโหมดมือถือ
const isMobileMenuOpen = ref(false)
</script>