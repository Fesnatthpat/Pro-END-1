<template>
    <div class="max-w-5xl mx-auto">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ดนักศึกษา</h1>
                <p class="text-gray-500 mt-1">ยินดีต้อนรับ, สมชาย ใจดี (รหัสนักศึกษา: 661234567)</p>
            </div>
            <div
                class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ปีการศึกษา 2569
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 class="text-lg font-bold text-gray-800 mb-1">สถานะโครงงานปัจจุบัน</h2>
                    <p class="text-gray-500 text-sm">คุณยังไม่ได้ทำการเสนอหัวข้อโครงงานคอมพิวเตอร์</p>
                </div>

                <div
                    class="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full text-sm border border-gray-200">
                    สถานะ: รอเสนอหัวข้อ
                </div>
            </div>

            <div class="mt-8">
                <div class="flex justify-between text-xs font-medium text-gray-400 mb-2">
                    <span class="text-blue-600 font-bold">1. เสนอหัวข้อ</span>
                    <span>2. สอบหัวข้อ</span>
                    <span>3. พัฒนา/ส่งเอกสาร</span>
                    <span>4. สอบจบ</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: 10%"></div>
                </div>
            </div>
        </div>

        <h3 class="text-lg font-bold text-gray-800 mb-4">เมนูจัดการโครงงาน</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <button
                class="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group">
                <div
                    class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-1">เสนอหัวข้อโครงงาน</h4>
                <p class="text-xs text-gray-500">กรอกแบบฟอร์มเพื่อขออนุมัติหัวข้อและอาจารย์ที่ปรึกษา</p>
            </button>

            <button disabled
                class="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed text-left">
                <div class="w-12 h-12 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-1">บันทึกการให้คำปรึกษา</h4>
                <p class="text-xs text-gray-500">เปิดใช้งานเมื่อหัวข้อโครงงานได้รับการอนุมัติแล้ว</p>
            </button>

            <button disabled
                class="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed text-left">
                <div class="w-12 h-12 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-1">ส่งไฟล์เอกสาร (บทที่ 1-5)</h4>
                <p class="text-xs text-gray-500">เปิดใช้งานเมื่อหัวข้อโครงงานได้รับการอนุมัติแล้ว</p>
            </button>

        </div>
    </div>
</template>

<script setup>
// ในอนาคตเราจะเขียนโค้ดเช็ค Role ตรงนี้ ว่าถ้าไม่ใช่ Student ให้ Redirect กลับไป
</script>