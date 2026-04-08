<template>
    <div>
        <section class="bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    ระบบบริหารจัดการ <br class="hidden lg:block" />
                    <span class="text-blue-600">การทำโครงงานคอมพิวเตอร์</span>
                </h1>
                <p class="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                    สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา <br />
                    แพลตฟอร์มที่ช่วยให้การเสนอหัวข้อ ติดตามความคืบหน้า และจัดเก็บเอกสารเป็นเรื่องง่ายและเป็นระบบ
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <NuxtLink to="/login"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg">
                        เข้าสู่ระบบ (สำหรับนักศึกษา/อาจารย์)
                    </NuxtLink>
                    <NuxtLink to="/projects"
                        class="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-semibold px-8 py-3 rounded-full transition-colors shadow-sm">
                        ค้นหาโครงงานรุ่นพี่
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900">ขั้นตอนการทำโครงงาน</h2>
                    <p class="text-gray-500 mt-2">กระบวนการที่เป็นระบบตั้งแต่เริ่มต้นจนจบการศึกษา</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div
                        class="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div
                            class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                            1</div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">เสนอหัวข้อ</h3>
                        <p class="text-gray-600 text-sm">นักศึกษายื่นเสนอหัวข้อโครงงานและเลือกอาจารย์ที่ปรึกษาผ่านระบบ
                        </p>
                    </div>
                    <div
                        class="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div
                            class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                            2</div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">อัปเดตความคืบหน้า</h3>
                        <p class="text-gray-600 text-sm">บันทึกการเข้าพบอาจารย์ที่ปรึกษา และอัปโหลดไฟล์เอกสารแต่ละบท</p>
                    </div>
                    <div
                        class="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div
                            class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                            3</div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">ยื่นสอบและส่งเล่ม</h3>
                        <p class="text-gray-600 text-sm">แจ้งความจำนงขอสอบจบ และจัดเก็บไฟล์เล่มบัณฑิตนิพนธ์ฉบับสมบูรณ์
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-slate-50 border-t border-gray-100">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-end mb-8 max-w-5xl mx-auto">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">โครงงานล่าสุด</h2>
                        <p class="text-gray-500 mt-1">ผลงานบัณฑิตนิพนธ์ที่เสร็จสมบูรณ์</p>
                    </div>
                    <NuxtLink to="/projects" class="text-blue-600 hover:underline font-medium text-sm">ดูทั้งหมด &rarr;
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <div v-for="i in 4" :key="i"
                        class="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
                        <div class="flex justify-between items-start mb-3">
                            <span
                                class="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">เสร็จสมบูรณ์</span>
                            <span class="text-sm text-gray-500">ปีการศึกษา 2566</span>
                        </div>
                        <h3
                            class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                            ระบบแชทบอทเพื่อการศึกษา แนะนำรายวิชาเรียน สาขาวิทยาการคอมพิวเตอร์
                        </h3>
                        <p class="text-sm text-gray-600 mb-4">ประเภท: Web Application</p>
                        <div class="flex items-center text-sm text-blue-600 font-medium">
                            อ่านบทคัดย่อ/บทที่ 1
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
// หน้านี้เราไม่ต้องประกาศ Layout เพราะมันจะดึง 'default' layout (ที่มี Navbar/Footer) มาใช้อัตโนมัติครับ
</script>