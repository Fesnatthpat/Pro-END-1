<template>
    <div class="max-w-6xl mx-auto">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">ระบบจัดการผู้ดูแลระบบ (Admin)</h1>
            <p class="text-gray-500 mt-1">ยินดีต้อนรับคุณ {{ user?.firstName }}, ภาพรวมของระบบและจัดการข้อมูลพื้นฐาน</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <NuxtLink to="/admin/users"
                class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-500 transition-all text-center group">
                <h4 class="font-bold text-gray-900 group-hover:text-blue-600">จัดการผู้ใช้งาน</h4>
                <p class="text-xs text-gray-500 mt-1">เพิ่ม/ลบ อาจารย์และนักศึกษา</p>
            </NuxtLink>
            <NuxtLink to="/admin/projects"
                class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-500 transition-all text-center group">
                <h4 class="font-bold text-gray-900 group-hover:text-blue-600">อนุมัติหัวข้อโครงงาน</h4>
                <p class="text-xs text-gray-500 mt-1">ตรวจสอบและเปลี่ยนสถานะ</p>
            </NuxtLink>
            <button
                class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center">
                <h4 class="font-bold text-gray-900">จัดการสอบ</h4>
                <p class="text-xs text-gray-500 mt-1">กำหนดวันเวลาสอบหัวข้อ/สอบจบ</p>
            </button>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})

const user = useCookie('user_data')
</script>