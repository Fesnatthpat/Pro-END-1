<template>
    <div class="max-w-5xl mx-auto pb-20">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-4 md:px-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ดนักศึกษา</h1>
                <p class="text-gray-500 mt-1 text-sm">ยินดีต้อนรับ, {{ user?.firstName }} {{ user?.lastName }}</p>
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
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8 relative overflow-hidden mx-4 md:mx-0">
            <div class="absolute top-0 left-0 w-full h-1.5" :class="statusColorClass"></div>

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 class="text-lg font-bold text-gray-800 mb-1">สถานะโครงงานปัจจุบัน</h2>
                    <div v-if="project" class="flex flex-col gap-1">
                        <p class="text-blue-600 font-bold text-lg leading-tight">{{ project.titleTh }}</p>
                        <p class="text-gray-400 text-xs italic">{{ project.titleEn }}</p>
                        <button @click="viewFullDescription(project)" class="text-blue-500 text-[10px] font-bold hover:underline text-left mt-1">ดูรายละเอียดที่เสนอไว้</button>
                    </div>
                    <p v-else class="text-gray-500 text-sm italic">คุณยังไม่ได้ทำการเสนอหัวข้อโครงงานคอมพิวเตอร์</p>
                </div>

                <div :class="statusBadgeClass">
                    {{ statusText }}
                </div>
            </div>

            <!-- Feedback from Admin (If Rejected) -->
            <div v-if="project && project.status === 'REJECTED' && project.feedback" class="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <div class="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-bold text-red-700 uppercase tracking-wider">เหตุผลที่ต้องแก้ไข:</span>
                </div>
                <p class="text-sm text-red-600">{{ project.feedback }}</p>
                <button @click="reSubmitProposal" class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    เสนอหัวข้อใหม่อีกครั้ง
                </button>
            </div>

            <!-- Progress Bar -->
            <div class="mt-8">
                <div class="flex justify-between text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                    <span :class="{ 'text-blue-600 font-extrabold': progress >= 10 }">1. เสนอหัวข้อ</span>
                    <span :class="{ 'text-blue-600 font-extrabold': progress >= 40 }">2. สอบหัวข้อ</span>
                    <span :class="{ 'text-blue-600 font-extrabold': progress >= 70 }">3. พัฒนา/ส่งเอกสาร</span>
                    <span :class="{ 'text-blue-600 font-extrabold': progress >= 100 }">4. สอบจบ</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                        :style="{ width: progress + '%' }"></div>
                </div>
            </div>
        </div>

        <!-- History of Proposals -->
        <div v-if="project && project.history && project.history.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 mx-4 md:mx-0">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">ประวัติการเสนอหัวข้อ ({{ project.history.length }} ครั้งก่อนหน้า)</h2>
            </div>
            <div class="divide-y divide-gray-100">
                <div v-for="h in project.history" :key="h.id" class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">ไม่ผ่าน/ให้แก้ไข</span>
                                <span class="text-gray-400 text-[10px] font-bold">{{ formatDate(h.createdAt) }}</span>
                            </div>
                            <h4 class="font-bold text-gray-900 mb-1 leading-tight">{{ h.titleTh }}</h4>
                            <p class="text-xs text-gray-400 mb-2 italic leading-tight">{{ h.titleEn }}</p>
                            <div v-if="h.feedback" class="p-3 bg-red-50/50 rounded-lg border border-red-100">
                                <p class="text-xs text-red-600"><span class="font-bold">เหตุผล:</span> {{ h.feedback }}</p>
                            </div>
                        </div>
                        <button @click="viewHistoryDescription(h)" class="shrink-0 text-blue-600 text-[10px] font-bold hover:underline">ดูรายละเอียด</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Menus -->
        <h3 class="text-lg font-bold text-gray-800 mb-4 px-4 md:px-0">เมนูจัดการโครงงาน</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 px-4 md:px-0">
            <!-- 1. เสนอหัวข้อ -->
            <button @click="openProposalModal" :disabled="project && project.status !== 'REJECTED'"
                class="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group disabled:opacity-60 disabled:cursor-not-allowed">
                <div
                    class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
                class="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed">
                <div class="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center mb-4 group-hover:enabled:bg-blue-600 group-hover:enabled:text-white transition-colors"
                    :class="{ 'bg-blue-50 text-blue-600': isApproved }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-1">บันทึกการให้คำปรึกษา</h4>
                <p class="text-xs text-gray-500">บันทึกรายละเอียดการเข้าพบอาจารย์ที่ปรึกษา</p>
            </button>

            <!-- 3. ส่งไฟล์เอกสาร -->
            <button @click="openDocModal" :disabled="!isApproved"
                class="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left group disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed">
                <div class="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center mb-4 group-hover:enabled:bg-blue-600 group-hover:enabled:text-white transition-colors"
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
            class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 mx-4 md:mx-0">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">เอกสารที่ส่งแล้ว</h2>
                <span class="text-xs font-medium text-gray-500">{{ documents.length }} ไฟล์</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th class="px-6 py-3">บทที่</th>
                            <th class="px-6 py-3">ชื่อไฟล์</th>
                            <th class="px-6 py-3">วันที่ส่ง</th>
                            <th class="px-6 py-3">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="doc in documents" :key="doc.id" class="text-sm hover:bg-gray-50 transition-colors">
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
        <div v-if="project" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mx-4 md:mx-0">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">ประวัติการให้คำปรึกษา</h2>
                <span class="text-xs font-medium text-gray-500">ทั้งหมด {{ consultations.length }} ครั้ง</span>
            </div>
            <div class="divide-y divide-gray-100">
                <div v-if="consultations.length === 0" class="p-10 text-center text-gray-400 italic">
                    ยังไม่มีบันทึกการให้คำปรึกษา
                </div>
                <div v-for="item in consultations" :key="item.id" class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-900 mb-1">{{ item.topic }}</h4>
                            <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ item.details }}</p>
                        </div>
                        <div class="text-right shrink-0">
                            <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">{{
                                formatDate(item.date) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- Proposal Modal -->
        <div v-if="showProposalModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 shadow-2xl">
                <div class="bg-white px-6 pt-6 pb-4 sm:px-8 sm:pt-8 flex justify-between items-center">
                    <h3 class="text-2xl font-bold text-gray-900">เสนอหัวข้อโครงงาน</h3>
                    <button @click="showProposalModal = false" class="text-gray-400 hover:text-gray-500">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="px-6 pb-6 sm:px-8 sm:pb-8 space-y-5">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">ชื่อโครงงาน (ภาษาไทย)</label>
                        <input v-model="proposalForm.titleTh" type="text"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="ระบุชื่อภาษาไทย...">
                    </div>
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">ชื่อโครงงาน (ภาษาอังกฤษ)</label>
                        <input v-model="proposalForm.titleEn" type="text"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Identify in English...">
                    </div>
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">อาจารย์ที่ปรึกษา</label>
                        <select v-model="proposalForm.advisorId"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                            <option value="" disabled>คลิกเพื่อเลือกอาจารย์...</option>
                            <option v-for="advisor in advisors" :key="advisor.id" :value="advisor.id">
                                อ.{{ advisor.firstName }} {{ advisor.lastName }}
                            </option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">รายละเอียดเบื้องต้น / ขอบเขต</label>
                        <textarea v-model="proposalForm.description" rows="4"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="อธิบายสั้นๆ เกี่ยวกับโครงงานของคุณ..."></textarea>
                    </div>
                    <div class="pt-4 flex gap-3">
                        <button @click="showProposalModal = false"
                            class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">ยกเลิก</button>
                        <button @click="submitProposal" :disabled="submitting"
                            class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50">
                            {{ submitting ? 'กำลังส่ง...' : 'ส่งหัวข้อโครงงาน' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Description Modal -->
        <div v-if="selectedProject" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 class="font-bold text-gray-900">รายละเอียดโครงงาน</h3>
                    <button @click="selectedProject = null" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-8 max-h-[70vh] overflow-y-auto">
                    <div class="mb-6">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ชื่อโครงงาน (ไทย)</h4>
                        <p class="text-lg font-bold text-gray-900 leading-snug">{{ selectedProject.titleTh }}</p>
                    </div>
                    <div class="mb-6">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ชื่อโครงงาน (ENG)</h4>
                        <p class="text-base text-gray-700 italic">{{ selectedProject.titleEn }}</p>
                    </div>
                    <div class="mb-6">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">รายละเอียดแบบเต็ม</h4>
                        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedProject.description }}</p>
                    </div>
                    <div v-if="selectedProject.status === 'REJECTED' && selectedProject.feedback" class="p-4 bg-red-50 border border-red-100 rounded-xl">
                        <h4 class="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">เหตุผลที่ให้แก้ไข</h4>
                        <p class="text-sm text-red-600 font-medium">{{ selectedProject.feedback }}</p>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 text-right">
                    <button @click="selectedProject = null" class="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">ปิดหน้าต่าง</button>
                </div>
            </div>
        </div>

        <!-- Consult Modal -->
        <div v-if="showConsultModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white rounded-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
                <div class="bg-white px-8 pt-8 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-900">บันทึกการให้คำปรึกษา</h3>
                    <button @click="showConsultModal = false" class="text-gray-400 hover:text-gray-600"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-8 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">วันที่เข้าพบ</label>
                        <input v-model="consultForm.date" type="date" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">หัวข้อการปรึกษา</label>
                        <input v-model="consultForm.topic" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ปรึกษาเรื่อง...">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">รายละเอียด</label>
                        <textarea v-model="consultForm.details" rows="4" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="อาจารย์แนะนำว่า..."></textarea>
                    </div>
                    <div class="pt-4 flex gap-3">
                        <button @click="showConsultModal = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl">ยกเลิก</button>
                        <button @click="submitConsultation" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">บันทึก</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Doc Modal -->
        <div v-if="showDocModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white rounded-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
                <div class="bg-white px-8 pt-8 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-900">ส่งไฟล์เอกสาร (บทที่ 1-5)</h3>
                    <button @click="showDocModal = false" class="text-gray-400 hover:text-gray-600"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-8 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">เลือกบทที่ต้องการส่ง</label>
                        <select v-model="docForm.chapter" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="1">บทที่ 1: บทนำ</option>
                            <option value="2">บทที่ 2: ทฤษฎีและงานวิจัยที่เกี่ยวข้อง</option>
                            <option value="3">บทที่ 3: วิธีดำเนินการดำเนินงาน</option>
                            <option value="4">บทที่ 4: ผลการดำเนินงาน</option>
                            <option value="5">บทที่ 5: สรุปผลและข้อเสนอแนะ</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">เลือกไฟล์เอกสาร</label>
                        <input @change="handleFileChange" type="file" accept=".pdf,.doc,.docx" class="w-full px-4 py-2 border border-dashed border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                    <div class="pt-4 flex gap-3">
                        <button @click="showDocModal = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl">ยกเลิก</button>
                        <button @click="submitDocument" :disabled="!docForm.fileName" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50">ส่งไฟล์</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const user = useCookie('user_data')
const project = ref(null)
const consultations = ref([])
const documents = ref([])
const advisors = ref([])
const showProposalModal = ref(false)
const showConsultModal = ref(false)
const showDocModal = ref(false)
const selectedProject = ref(null)
const submitting = ref(false)

const proposalForm = ref({ titleTh: '', titleEn: '', advisorId: '', description: '' })
const consultForm = ref({ date: new Date().toISOString().substr(0, 10), topic: '', details: '' })
const docForm = ref({ chapter: '1', fileName: '', fileUrl: '' })

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
    } catch (e) { console.error('Failed to fetch data') }
}

const fetchAdvisors = async () => {
    try { advisors.value = await $fetch('/api/advisors') } catch (e) { console.error('Failed to fetch advisors') }
}

onMounted(() => { fetchData(); fetchAdvisors(); })

const statusText = computed(() => {
    if (!project.value) return 'รอเสนอหัวข้อ'
    switch (project.value.status) {
        case 'PENDING': return 'รอการอนุมัติ'
        case 'APPROVED': return 'ผ่านการอนุมัติ'
        case 'REJECTED': return 'ต้องแก้ไข'
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
    const base = 'px-4 py-2 font-bold rounded-full text-xs border uppercase tracking-widest '
    if (!project.value) return base + 'bg-gray-50 text-gray-500 border-gray-200'
    switch (project.value.status) {
        case 'PENDING': return base + 'bg-yellow-50 text-yellow-700 border-yellow-100'
        case 'APPROVED': return base + 'bg-green-50 text-green-700 border-green-100'
        case 'REJECTED': return base + 'bg-red-50 text-red-700 border-red-100'
        default: return base + 'bg-gray-50 text-gray-500 border-gray-200'
    }
})

const progress = computed(() => {
    if (!project.value || project.value.status === 'REJECTED') return 10
    if (project.value.status === 'PENDING') return 25
    if (project.value.status === 'APPROVED') {
        const approvedDocs = documents.value.filter(d => d.status === 'APPROVED').length
        return 40 + (approvedDocs * 12)
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
    const base = 'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase '
    switch (status) {
        case 'PENDING': return base + 'bg-yellow-50 text-yellow-600 border border-yellow-100'
        case 'APPROVED': return base + 'bg-green-50 text-green-600 border border-green-100'
        case 'REJECTED': return base + 'bg-red-50 text-red-600 border border-red-100'
        default: return base + 'bg-gray-50 text-gray-400'
    }
}

const openProposalModal = () => {
    if (project.value?.status === 'REJECTED') {
        proposalForm.value = {
            titleTh: project.value.titleTh,
            titleEn: project.value.titleEn,
            advisorId: project.value.advisorId,
            description: project.value.description
        }
    }
    showProposalModal.value = true
}

const openConsultModal = () => {
    consultForm.value = { date: new Date().toISOString().substr(0, 10), topic: '', details: '' }
    showConsultModal.value = true
}

const openDocModal = () => {
    docForm.value = { chapter: '1', fileName: '', fileUrl: '' }
    showDocModal.value = true
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        docForm.value.fileName = file.name
        docForm.value.fileUrl = 'uploads/' + file.name
    }
}

const viewFullDescription = (proj) => {
    selectedProject.value = proj
}

const viewHistoryDescription = (h) => {
    selectedProject.value = {
        ...h,
        status: 'REJECTED' // เพื่อให้ Modal แสดง Feedback
    }
}

const reSubmitProposal = () => {
    openProposalModal()
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
    } catch (e) { 
        console.error('Submit error:', e)
        alert(e.data?.statusMessage || 'เกิดข้อผิดพลาดในการส่งหัวข้อ')
    } finally { submitting.value = false }
}

const submitConsultation = async () => {
    if (!consultForm.value.topic) return alert('กรุณากรอกหัวข้อ')
    try {
        await $fetch('/api/student/consultations', { method: 'POST', body: { ...consultForm.value, projectId: project.value.id } })
        showConsultModal.value = false; await fetchData(); alert('บันทึกสำเร็จ')
    } catch (e) { alert('เกิดข้อผิดพลาด') }
}

const submitDocument = async () => {
    if (!docForm.value.fileName) return alert('กรุณาเลือกไฟล์')
    try {
        await $fetch('/api/student/documents', { method: 'POST', body: { ...docForm.value, projectId: project.value.id } })
        showDocModal.value = false; await fetchData(); alert('ส่งเอกสารสำเร็จ')
    } catch (e) { alert('เกิดข้อผิดพลาด') }
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }).format(date)
}
</script>
