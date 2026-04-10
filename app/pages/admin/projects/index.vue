<template>
    <div class="max-w-6xl mx-auto pb-10">
        <div class="mb-8 flex justify-between items-center px-4 md:px-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">อนุมัติหัวข้อโครงงาน (Admin)</h1>
                <p class="text-gray-500 mt-1 text-sm md:text-base">ตรวจสอบและพิจารณาหัวข้อโครงงานที่นักศึกษายื่นเสนอ</p>
            </div>
            <NuxtLink to="/admin/dashboard" class="text-sm text-blue-600 hover:underline">กลับไปหน้าแดชบอร์ด</NuxtLink>
        </div>

        <!-- รายการรออนุมัติ -->
        <div v-if="pendingProjects.length === 0" class="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300 mx-4 md:mx-0">
            <p class="text-gray-500 italic">ไม่มีรายการรออนุมัติในขณะนี้</p>
        </div>

        <div v-else class="space-y-6 px-4 md:px-0">
            <div v-for="project in pendingProjects" :key="project.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                <div class="p-6">
                    <div class="flex flex-col lg:flex-row justify-between gap-6">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">รออนุมัติหัวข้อ</span>
                                <span class="text-gray-400 text-xs">{{ formatDate(project.createdAt) }}</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ project.titleTh }}</h3>
                            <p class="text-sm text-gray-500 italic mb-4">{{ project.titleEn }}</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl mb-4">
                                <div>
                                    <p class="text-gray-500 text-[10px] font-bold uppercase mb-1 tracking-wider">นักศึกษา</p>
                                    <p class="font-medium text-gray-900">{{ project.student.firstName }} {{ project.student.lastName }}</p>
                                    <p class="text-xs text-gray-400">{{ project.student.email }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-500 text-[10px] font-bold uppercase mb-1 tracking-wider">อาจารย์ที่ปรึกษา</p>
                                    <p class="font-medium text-gray-900">อ.{{ project.advisor.firstName }} {{ project.advisor.lastName }}</p>
                                </div>
                            </div>

                            <div v-if="project.description" class="mt-4">
                                <p class="text-gray-500 text-[10px] font-bold uppercase mb-1 tracking-wider">คำอธิบายโครงงานเบื้องต้น</p>
                                <div class="relative group">
                                    <p class="text-sm text-gray-700 line-clamp-2" :ref="'desc-' + project.id">
                                        {{ project.description }}
                                    </p>
                                    <button @click="viewFullDescription(project)" class="mt-1 text-blue-600 text-xs font-bold hover:underline">อ่านรายละเอียดเพิ่มเติม</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="lg:w-72 space-y-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">หมายเหตุ (ถ้ามี)</label>
                                <textarea v-model="rejectionFeedback[project.id]" 
                                    class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                    placeholder="ระบุเหตุผลที่ให้แก้ไข..."></textarea>
                            </div>
                            <div class="flex flex-col gap-2">
                                <button @click="updateProjectStatus(project.id, 'APPROVED')" 
                                    class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    อนุมัติหัวข้อ
                                </button>
                                <button @click="updateProjectStatus(project.id, 'REJECTED')" 
                                    class="w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    ให้แก้ไข/ไม่อนุมัติ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- รายการรอตรวจเอกสาร -->
        <div v-if="pendingDocuments.length > 0" class="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mx-4 md:mx-0">
            <div class="px-6 py-4 border-b border-gray-100 bg-blue-50/30 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">รายการเอกสารรอตรวจ (บทที่ 1-5)</h2>
                <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ pendingDocuments.length }} ไฟล์</span>
            </div>
            <div class="divide-y divide-gray-100">
                <div v-for="doc in pendingDocuments" :key="doc.id" class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex flex-col lg:flex-row justify-between gap-6">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">WAITING REVIEW</span>
                                <span class="text-gray-400 text-xs">{{ formatDate(doc.createdAt) }}</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 mb-1">บทที่ {{ doc.chapter }} ({{ doc.fileName }})</h3>
                            <p class="text-sm text-blue-600 font-medium mb-3">โครงงาน: {{ getProjectTitle(doc.projectId) }}</p>
                            <p class="text-xs text-gray-500">นักศึกษา: {{ getStudentName(doc.projectId) }}</p>
                        </div>
                        <div class="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                            <button @click="updateDocStatus(doc.id, 'APPROVED')" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors">ผ่าน (Approved)</button>
                            <button @click="updateDocStatus(doc.id, 'REJECTED')" class="px-5 py-2 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg font-bold text-sm transition-colors">ให้แก้ไข (Reject)</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- รายการที่อนุมัติแล้ว (ประวัติ) -->
        <div class="mt-12 px-4 md:px-0">
            <h2 class="text-lg font-bold text-gray-800 mb-4">ประวัติการดำเนินการ (หัวข้อโครงงาน)</h2>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                            <tr>
                                <th class="px-6 py-4">ชื่อโครงงาน</th>
                                <th class="px-6 py-4">นักศึกษา / ที่ปรึกษา</th>
                                <th class="px-6 py-4 text-center">สถานะ</th>
                                <th class="px-6 py-4">เหตุผล / หมายเหตุ</th>
                                <th class="px-6 py-4 text-right">วันที่</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="project in historicalProjects" :key="project.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 max-w-xs">
                                    <p class="font-bold text-gray-900 text-sm truncate" :title="project.titleTh">{{ project.titleTh }}</p>
                                    <button @click="viewFullDescription(project)" class="text-[10px] text-blue-600 hover:underline">ดูรายละเอียด</button>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p class="text-sm font-medium text-gray-700">{{ project.student.firstName }}</p>
                                    <p class="text-xs text-gray-400">อ.{{ project.advisor.firstName }}</p>
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap">
                                    <span v-if="project.status === 'APPROVED'" class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">APPROVED</span>
                                    <span v-else class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">REJECTED</span>
                                </td>
                                <td class="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" :title="project.feedback">
                                    {{ project.feedback || '-' }}
                                </td>
                                <td class="px-6 py-4 text-right text-xs text-gray-500 whitespace-nowrap">
                                    {{ formatDate(project.updatedAt) }}
                                </td>
                            </tr>
                            <tr v-if="historicalProjects.length === 0">
                                <td colspan="5" class="px-6 py-10 text-center text-gray-400 italic">ยังไม่มีประวัติการดำเนินการ</td>
                            </tr>
                        </tbody>
                    </table>
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
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">รายละเอียดแบบเต็ม</h4>
                        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedProject.description }}</p>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 text-right">
                    <button @click="selectedProject = null" class="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">ปิดหน้าต่าง</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const user = useCookie('user_data')
const projects = ref([])
const rejectionFeedback = ref({})
const selectedProject = ref(null)

const fetchProjects = async () => {
    try {
        projects.value = await $fetch('/api/admin/projects')
    } catch (e) { console.error('Error fetching projects') }
}

const updateProjectStatus = async (id, status) => {
    const feedback = rejectionFeedback.value[id] || ''
    
    if (status === 'REJECTED' && !feedback) {
        if (!confirm('ยืนยันการไม่อนุมัติโดยไม่ระบุเหตุผล?')) return
    } else {
        if (!confirm('ยืนยันการดำเนินการ?')) return
    }

    try {
        await $fetch(`/api/admin/projects/${id}`, { 
            method: 'PUT', 
            body: { 
                status,
                feedback // ส่งเหตุผลไปด้วย
            } 
        })
        rejectionFeedback.value[id] = ''
        await fetchProjects()
    } catch (e) { 
        console.error('Update error:', e)
        alert(e.data?.statusMessage || 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
}

const updateDocStatus = async (id, status) => {
    if (!confirm('ยืนยันสถานะการตรวจเอกสาร?')) return
    try {
        await $fetch('/api/admin/documents', { method: 'PUT', body: { id, status } })
        await fetchProjects()
    } catch (e) { 
        console.error('Update error:', e)
        alert(e.data?.statusMessage || 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
}

const viewFullDescription = (project) => {
    selectedProject.value = project
}

const pendingProjects = computed(() => projects.value.filter(p => p.status === 'PENDING'))
const historicalProjects = computed(() => projects.value.filter(p => p.status !== 'PENDING'))

const pendingDocuments = computed(() => {
    const docs = []
    projects.value.forEach(p => {
        p.documents.forEach(d => {
            if (d.status === 'PENDING') {
                docs.push(d)
            }
        })
    })
    return docs
})

const getProjectTitle = (projectId) => {
    const p = projects.value.find(p => p.id === projectId)
    return p ? p.titleTh : ''
}

const getStudentName = (projectId) => {
    const p = projects.value.find(p => p.id === projectId)
    return p ? `${p.student.firstName} ${p.student.lastName}` : ''
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('th-TH', { 
        day: '2-digit', 
        month: 'short', 
        year: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
    }).format(date)
}

onMounted(() => {
    if (user.value?.role !== 'ADMIN') {
        navigateTo('/login')
        return
    }
    fetchProjects()
})
</script>
