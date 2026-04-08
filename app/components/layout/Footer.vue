<template>
    <footer class="bg-[#f8f9fa] pt-12 pb-6 border-t border-gray-200">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">

                <div>
                    <h3 class="font-bold text-lg mb-4 text-gray-800">CS PROJECT</h3>
                    <p class="text-gray-600 leading-relaxed">
                        ระบบบริหารจัดการการทำโครงงานคอมพิวเตอร์<br>มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา</p>
                </div>

                <div>
                    <h3 class="font-bold text-lg mb-4 text-gray-800">บริการของเรา</h3>
                    <ul class="text-gray-600 space-y-3">
                        <li>
                            <NuxtLink to="#" class="hover:text-blue-600 transition-colors">ขั้นตอนการทำโครงงาน
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#" class="hover:text-blue-600 transition-colors">ดาวน์โหลดเอกสาร</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#" class="hover:text-blue-600 transition-colors">คู่มือการใช้งานระบบ
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-bold text-lg mb-4 text-gray-800">ติดต่อเรา</h3>
                    <ul class="text-gray-600 space-y-3">
                        <li>สาขาวิทยาการคอมพิวเตอร์</li>
                        <li>Tel: 02-473-7000</li>
                        <li>กรุงเทพมหานคร, ประเทศไทย</li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-bold text-lg mb-4 text-gray-800">รับข่าวสารและประกาศ</h3>
                    <input type="email" placeholder="อีเมลของคุณ"
                        class="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>

            <div
                class="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6 text-xs text-gray-500">
                <p>&copy; 2026 Computer Science BSRU. All rights reserved.</p>
                <div class="flex gap-4 mt-4 md:mt-0 font-medium">
                    <span class="hover:text-gray-800 cursor-pointer">ADMIN</span>
                    <span class="hover:text-gray-800 cursor-pointer">ADVISOR</span>
                    <span class="hover:text-gray-800 cursor-pointer">STUDENT</span>
                </div>
            </div>
        </div>
    </footer>
</template>