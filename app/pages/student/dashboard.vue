<template>
    <div class="max-w-5xl mx-auto pb-20">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ดนักศึกษา</h1>
                <p class="text-gray-500 mt-1">ยินดีต้อนรับ, {{ user?.firstName }} {{ user?.lastName }}</p>
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

        <!-- Project Status Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1.5" :class="statusColorClass"></div>

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 class="text-lg font-bold text-gray-800 mb-1">สถานะโครงงานปัจจุบัน</h2>
                    <p v-if="project" class="text-blue-600 font-medium">{{ project.titleTh }}</p>
                    <p v-else class="text-gray-500 text-sm">คุณยังไม่ได้ทำการเสนอหัวข้อโครงงานคอมพิวเตอร์</p>
                </div>

                <div :class="statusBadgeClass">
                    สถานะ: {{ statusText }}
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-8">
                <div class="flex justify-between text-xs font-medium text-gray-400 mb-2">
                    <span :class="{ 'text-blue-600 font-bold': progress >= 10 }">1. เสนอหัวข้อ</span>
                    <span :class="{ 'text-blue-600 font-bold': progress >= 40 }">2. สอบหัวข้อ</span>
                    <span :class="{ 'text-blue-600 font-bold': progress >= 70 }">3. พัฒนา/ส่งเอกสาร</span>
                    <span :class="{ 'text-blue-600 font-bold': progress >= 100 }">4. สอบจบ</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        :style="{ width: progress + '%' }"></div>
                </div>
            </div>
        </div>

        <!-- Action Menus -->
        <h3 class="text-lg font-bold text-gray-800 mb-4">เมนูจัดการโครงงาน</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <!-- 1. เสนอหัวข้อ -->
            <button @click="openProposalModal" :disabled="project"
                class="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group disabled:opacity-60 disabled:cursor-not-allowed">
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

            <!-- 2. บันทึกการให้คำปรึกษา -->
            <button @click="openConsultModal" :disabled="!isApproved"
                class="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed">
                <div class="w-12 h-12 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center mb-4 group-hover:enabled:bg-blue-600 group-hover:enabled:text-white transition-colors"
                    :class="{ 'bg-blue-50 text-blue-600': isApproved }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-1">บันทึกการให้คำปรึกษา</h4>
                <p class="text-xs text-gray-500">บันทึกรายละเอียดการเข้าพบอาจารย์ที่ปรึกษา</p>
            </button>

            <!-- 3. ส่งไฟล์เอกสาร -->
            <button @click="openDocModal" :disabled="!isApproved"
                class="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed">
                <div class="w-12 h-12 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center mb-4 group-hover:enabled:bg-blue-600 group-hover:enabled:text-white transition-colors"
                    :class="{ 'bg-blue-50 text-blue-600': isApproved }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-1">ส่งไฟล์เอกสาร (บทที่ 1-5)</h4>
                <p class="text-xs text-gray-500">อัปโหลดไฟล์ความคืบหน้าของโครงงาน</p>
            </button>
        </div>

        <!-- รายการเอกสาร (ถ้ามี) -->
        <div v-if="project && documents.length > 0"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">เอกสารที่ส่งแล้ว</h2>
                <span class="text-xs font-medium text-gray-500">{{ documents.length }} ไฟล์</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                        <tr>
                            <th class="px-6 py-3">บทที่</th>
                            <th class="px-6 py-3">ชื่อไฟล์</th>
                            <th class="px-6 py-3">วันที่ส่ง</th>
                            <th class="px-6 py-3">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="doc in documents" :key="doc.id" class="text-sm">
                            <td class="px-6 py-4 font-bold text-gray-900">บทที่ {{ doc.chapter }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ doc.fileName }}</td>
                            <td class="px-6 py-4 text-gray-400 text-xs">{{ formatDate(doc.createdAt) }}</td>
                            <td class="px-6 py-4">
                                <span :class="getDocStatusClass(doc.status)">{{ getDocStatusText(doc.status) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ประวัติการให้คำปรึกษา -->
        <div v-if="project" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">ประวัติการให้คำปรึกษา</h2>
                <span class="text-xs font-medium text-gray-500">ทั้งหมด {{ consultations.length }} ครั้ง</span>
            </div>
            <div class="divide-y divide-gray-100">
                <div v-if="consultations.length === 0" class="p-10 text-center text-gray-400 italic">
                    ยังไม่มีบันทึกการให้คำปรึกษา
                </div>
                <div v-for="item in consultations" :key="item.id" class="p-6">
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-900 mb-1">{{ item.topic }}</h4>
                            <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ item.details }}</p>
                        </div>
                        <div class="text-right shrink-0">
                            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{{
                                formatDate(item.date) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Proposal Modal -->
        <div v-if="showProposalModal" class="fixed inset-0 z-[60] overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div class="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-4">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-gray-900">เสนอหัวข้อโครงงาน</h3>
                            <button @click="showProposalModal = false" class="text-gray-400 hover:text-gray-500">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงงาน
                                    (ภาษาไทย)</label>
                                <input v-model="proposalForm.titleTh" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="เช่น ระบบจัดการโครงงานนักศึกษา">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงงาน
                                    (ภาษาอังกฤษ)</label>
                                <input v-model="proposalForm.titleEn" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="เช่น Student Project Management System">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">อาจารย์ที่ปรึกษา</label>
                                <select v-model="proposalForm.advisorId"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    <option value="" disabled>เลือกอาจารย์ที่ปรึกษา</option>
                                    <option v-for="advisor in advisors" :key="advisor.id" :value="advisor.id">{{
                                        advisor.firstName }} {{ advisor.lastName }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเบื้องต้น
                                    (ย่อ)</label>
                                <textarea v-model="proposalForm.description" rows="3"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="อธิบายสั้นๆ เกี่ยวกับโครงงานของคุณ..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
                        <button @click="submitProposal" :disabled="submitting"
                            class="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:w-auto sm:text-sm disabled:opacity-50">
                            {{ submitting ? 'กำลังบันทึก...' : 'ส่งหัวข้อโครงงาน' }}
                        </button>
                        <button @click="showProposalModal = false"
                            class="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Consultation Modal -->
        <div v-if="showProposalModal" class="fixed inset-0 z-[60] overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showProposalModal = false">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    class="relative z-10 inline-block w-full max-w-2xl align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-gray-900">เสนอหัวข้อโครงงาน</h3>
                            <button @click="showProposalModal = false" class="text-gray-400 hover:text-gray-500">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงงาน
                                    (ภาษาไทย)</label>
                                <input v-model="proposalForm.titleTh" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="เช่น ระบบจัดการโครงงานนักศึกษา">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อโครงงาน
                                    (ภาษาอังกฤษ)</label>
                                <input v-model="proposalForm.titleEn" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="เช่น Student Project Management System">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">อาจารย์ที่ปรึกษา</label>
                                <select v-model="proposalForm.advisorId"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    <option value="" disabled>เลือกอาจารย์ที่ปรึกษา</option>
                                    <option v-for="advisor in advisors" :key="advisor.id" :value="advisor.id">{{
                                        advisor.firstName }} {{ advisor.lastName }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเบื้องต้น
                                    (ย่อ)</label>
                                <textarea v-model="proposalForm.description" rows="3"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="อธิบายสั้นๆ เกี่ยวกับโครงงานของคุณ..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
                        <button @click="submitProposal" :disabled="submitting"
                            class="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:w-auto sm:text-sm disabled:opacity-50">
                            {{ submitting ? 'กำลังบันทึก...' : 'ส่งหัวข้อโครงงาน' }}
                        </button>
                        <button @click="showProposalModal = false"
                            class="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showConsultModal" class="fixed inset-0 z-[60] overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showConsultModal = false">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    class="relative z-10 inline-block w-full max-w-2xl align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-gray-900">บันทึกการให้คำปรึกษา</h3>
                            <button @click="showConsultModal = false" class="text-gray-400 hover:text-gray-500">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">วันที่เข้าพบ</label>
                                <input v-model="consultForm.date" type="date"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">หัวข้อการปรึกษา</label>
                                <input v-model="consultForm.topic" type="text"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="เช่น ปรึกษาเรื่องขอบเขตโครงงาน หรือ การออกแบบฐานข้อมูล">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม</label>
                                <textarea v-model="consultForm.details" rows="4"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="รายละเอียดที่อาจารย์แนะนำ..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
                        <button @click="submitConsultation" :disabled="submitting"
                            class="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:w-auto sm:text-sm disabled:opacity-50">
                            {{ submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
                        </button>
                        <button @click="showConsultModal = false"
                            class="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Document Upload Modal -->
        <div v-if="showDocModal" class="fixed inset-0 z-[60] overflow-y-auto">
            <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

                <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showDocModal = false">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="relative z-10 inline-block w-full max-w-2xl align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">

                    <div class="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-gray-900">ส่งไฟล์เอกสาร (บทที่ 1-5)</h3>
                            <button @click="showDocModal = false" class="text-gray-400 hover:text-gray-500">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">เลือกบทที่ต้องการส่ง</label>
                                <select v-model="docForm.chapter"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    <option value="1">บทที่ 1: บทนำ</option>
                                    <option value="2">บทที่ 2: ทฤษฎีและงานวิจัยที่เกี่ยวข้อง</option>
                                    <option value="3">บทที่ 3: วิธีดำเนินการดำเนินงาน</option>
                                    <option value="4">บทที่ 4: ผลการดำเนินงาน</option>
                                    <option value="5">บทที่ 5: สรุปผลและข้อเสนอแนะ</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">เลือกไฟล์เอกสาร
                                    (PDF/Word)</label>
                                <input @change="handleFileChange" type="file" accept=".pdf,.doc,.docx"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                                <p class="text-[10px] text-gray-400 mt-1">* สำหรับ Prototype
                                    จะจำลองการอัปโหลดโดยการใช้ชื่อไฟล์</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
                        <button @click="submitDocument" :disabled="submitting || !docForm.fileName"
                            class="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:w-auto sm:text-sm disabled:opacity-50">
                            {{ submitting ? 'กำลังส่งไฟล์...' : 'ส่งไฟล์เอกสาร' }}
                        </button>
                        <button @click="showDocModal = false"
                            class="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})

const user = useCookie('user_data')
const project = ref(null)
const consultations = ref([])
const documents = ref([])
const advisors = ref([])
const showProposalModal = ref(false)
const showConsultModal = ref(false)
const showDocModal = ref(false)
const submitting = ref(false)

const proposalForm = ref({ titleTh: '', titleEn: '', advisorId: '', description: '' })
const consultForm = ref({ date: new Date().toISOString().substr(0, 10), topic: '', details: '' })
const docForm = ref({ chapter: '1', fileName: '', fileUrl: '' })

// Fetch Data
const fetchData = async () => {
    if (!user.value?.id) return
    try {
        const projectData = await $fetch('/api/student/projects', { params: { studentId: user.value.id } })
        project.value = projectData
        if (projectData) {
            const [ consultData, docData ] = await Promise.all([
                $fetch('/api/student/consultations', { params: { projectId: projectData.id } }),
                $fetch('/api/student/documents', { params: { projectId: projectData.id } })
            ])
            consultations.value = consultData
            documents.value = docData
        }
    } catch (e) {
        console.error('Failed to fetch data')
    }
}

const fetchAdvisors = async () => {
    try {
        const data = await $fetch('/api/advisors')
        advisors.value = data
    } catch (e) {
        console.error('Failed to fetch advisors')
    }
}

onMounted(() => {
    fetchData()
    fetchAdvisors()
})

// UI Helpers
const statusText = computed(() => {
    if (!project.value) return 'รอเสนอหัวข้อ'
    switch (project.value.status) {
        case 'PENDING': return 'รอการอนุมัติ'
        case 'APPROVED': return 'ผ่านการอนุมัติ'
        case 'REJECTED': return 'ไม่ผ่านการอนุมัติ'
        default: return 'รอเสนอหัวข้อ'
    }
})

const statusColorClass = computed(() => {
    if (!project.value) return 'bg-gray-400'
    switch (project.value.status) {
        case 'PENDING': return 'bg-yellow-400'
        case 'APPROVED': return 'bg-green-500'
        case 'REJECTED': return 'bg-red-500'
        default: return 'bg-gray-400'
    }
})

const statusBadgeClass = computed(() => {
    const base = 'px-4 py-2 font-semibold rounded-full text-sm border '
    if (!project.value) return base + 'bg-gray-100 text-gray-700 border-gray-200'
    switch (project.value.status) {
        case 'PENDING': return base + 'bg-yellow-50 text-yellow-700 border-yellow-100'
        case 'APPROVED': return base + 'bg-green-50 text-green-700 border-green-100'
        case 'REJECTED': return base + 'bg-red-50 text-red-700 border-red-100'
        default: return base + 'bg-gray-100 text-gray-700 border-gray-200'
    }
})

const progress = computed(() => {
    if (!project.value) return 10
    if (project.value.status === 'PENDING') return 25
    if (project.value.status === 'APPROVED') {
        const approvedDocs = documents.value.filter(d => d.status === 'APPROVED').length
        return 40 + (approvedDocs * 10) // ขยับทีละ 10% ตามจำนวนบทที่ผ่าน
    }
    return 10
})

const isApproved = computed(() => project.value?.status === 'APPROVED')

const getDocStatusText = (status) => {
    switch (status) {
        case 'PENDING': return 'รอตรวจ'
        case 'APPROVED': return 'ผ่านแล้ว'
        case 'REJECTED': return 'ให้แก้ไข'
        default: return status
    }
}

const getDocStatusClass = (status) => {
    const base = 'px-2 py-0.5 rounded-full text-[10px] font-bold '
    switch (status) {
        case 'PENDING': return base + 'bg-yellow-100 text-yellow-700'
        case 'APPROVED': return base + 'bg-green-100 text-green-700'
        case 'REJECTED': return base + 'bg-red-100 text-red-700'
        default: return base + 'bg-gray-100 text-gray-700'
    }
}

// Handlers
const openProposalModal = () => showProposalModal.value = true
const openConsultModal = () => {
    consultForm.value = { date: new Date().toISOString().substr(0, 10), topic: '', details: '' }
    showConsultModal.value = true
}
const openDocModal = () => {
    docForm.value = { chapter: '1', fileName: '', fileUrl: '' }
    showDocModal.value = true
}

const handleFileChange = (e) => {
    const file = e.target.files[ 0 ]
    if (file) {
        docForm.value.fileName = file.name
        docForm.value.fileUrl = 'uploads/' + file.name // Mock path
    }
}

const submitProposal = async () => {
    if (!proposalForm.value.titleTh || !proposalForm.value.titleEn || !proposalForm.value.advisorId) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน')
        return
    }
    submitting.value = true
    try {
        await $fetch('/api/student/projects', { method: 'POST', body: { ...proposalForm.value, studentId: user.value.id } })
        showProposalModal.value = false
        await fetchData()
        alert('ส่งหัวข้อสำเร็จ')
    } catch (e) { alert('เกิดข้อผิดพลาด') } finally { submitting.value = false }
}

const submitConsultation = async () => {
    if (!consultForm.value.topic) return alert('กรุณากรอกหัวข้อ')
    submitting.value = true
    try {
        await $fetch('/api/student/consultations', { method: 'POST', body: { ...consultForm.value, projectId: project.value.id } })
        showConsultModal.value = false
        await fetchData()
        alert('บันทึกสำเร็จ')
    } catch (e) { alert('เกิดข้อผิดพลาด') } finally { submitting.value = false }
}

const submitDocument = async () => {
    if (!docForm.value.fileName) return alert('กรุณาเลือกไฟล์')
    submitting.value = true
    try {
        await $fetch('/api/student/documents', {
            method: 'POST',
            body: { ...docForm.value, projectId: project.value.id }
        })
        showDocModal.value = false
        await fetchData()
        alert('ส่งเอกสารสำเร็จ')
    } catch (e) { alert('เกิดข้อผิดพลาด') } finally { submitting.value = false }
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }).format(date)
}
</script>
