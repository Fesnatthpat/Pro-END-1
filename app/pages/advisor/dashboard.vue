<template>
    <div class="max-w-6xl mx-auto pb-10">
        <div class="mb-8 text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ดอาจารย์ที่ปรึกษา</h1>
            <p class="text-gray-500 mt-1">สวัสดีครับอาจารย์ {{ user?.firstName }}, ตรวจสอบความคืบหน้าและให้คำปรึกษานักศึกษาในความดูแล</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-orange-500">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">เสนอหัวข้อใหม่</h3>
                <p class="text-3xl font-extrabold text-orange-500 mt-2">{{ pendingProjects.length }} <span class="text-sm text-gray-400 font-normal">รายการรอตรวจ</span></p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">โครงงานในดูแล</h3>
                <p class="text-3xl font-extrabold text-green-500 mt-2">{{ approvedProjects.length }} <span class="text-sm text-gray-400 font-normal">โครงงาน</span></p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">รอตรวจเอกสาร</h3>
                <p class="text-3xl font-extrabold text-blue-500 mt-2">{{ pendingDocsCount }} <span class="text-sm text-gray-400 font-normal">ไฟล์รอดำเนินการ</span></p>
            </div>
        </div>

        <!-- รายการรอการอนุมัติหัวข้อ -->
        <div v-if="pendingProjects.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-100 bg-orange-50/30 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">รายการเสนอหัวข้อโครงงาน (รออนุมัติ)</h2>
                <span class="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ pendingProjects.length }} รายการ</span>
            </div>
            <div class="divide-y divide-gray-100">
                <div v-for="project in pendingProjects" :key="project.id" class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex flex-col lg:flex-row justify-between gap-6">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">NEW PROPOSAL</span>
                                <span class="text-gray-400 text-xs">{{ formatDate(project.createdAt) }}</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ project.titleTh }}</h3>
                            <p class="text-sm text-gray-500 italic mb-3">{{ project.titleEn }}</p>
                            <div class="flex items-center gap-4 text-sm text-gray-600">
                                <div class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    นักศึกษา: <span class="font-medium text-gray-900">{{ project.student.firstName }} {{ project.student.lastName }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                            <button @click="updateProjectStatus(project.id, 'APPROVED')" class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm">อนุมัติหัวข้อ</button>
                            <button @click="updateProjectStatus(project.id, 'REJECTED')" class="px-5 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold text-sm transition-colors">ไม่อนุมัติ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- รายการรอตรวจเอกสาร -->
        <div v-if="pendingDocsCount > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-100 bg-blue-50/30 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">รายการเอกสารรอตรวจ (บทที่ 1-5)</h2>
                <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ pendingDocsCount }} ไฟล์</span>
            </div>
            <div class="divide-y divide-gray-100">
                <template v-for="project in approvedProjects" :key="'docs-'+project.id">
                    <div v-for="doc in project.documents.filter(d => d.status === 'PENDING')" :key="doc.id" class="p-6 hover:bg-gray-50 transition-colors">
                        <div class="flex flex-col lg:flex-row justify-between gap-6">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">WAITING REVIEW</span>
                                    <span class="text-gray-400 text-xs">{{ formatDate(doc.createdAt) }}</span>
                                </div>
                                <h3 class="text-lg font-bold text-gray-900 mb-1">บทที่ {{ doc.chapter }} ({{ doc.fileName }})</h3>
                                <p class="text-sm text-blue-600 font-medium mb-3">โครงงาน: {{ project.titleTh }}</p>
                                <p class="text-xs text-gray-500">นักศึกษา: {{ project.student.firstName }} {{ project.student.lastName }}</p>
                            </div>
                            <div class="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                                <button @click="updateDocStatus(doc.id, 'APPROVED')" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors">ผ่าน (Approved)</button>
                                <button @click="updateDocStatus(doc.id, 'REJECTED')" class="px-5 py-2 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg font-bold text-sm transition-colors">ให้แก้ไข (Reject)</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- รายชื่อโครงงานในดูแล -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800">โครงงานในความดูแลทั้งหมด</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                        <tr>
                            <th class="px-6 py-4">ชื่อโครงงาน / นักศึกษา</th>
                            <th class="px-6 py-4">สถานะบทที่ (1-5)</th>
                            <th class="px-6 py-4 text-right">ความคืบหน้า</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="approvedProjects.length === 0">
                            <td colspan="3" class="px-6 py-10 text-center text-gray-400 italic">ยังไม่มีโครงงานที่อนุมัติ</td>
                        </tr>
                        <tr v-for="project in approvedProjects" :key="project.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <p class="font-bold text-gray-900">{{ project.titleTh }}</p>
                                <p class="text-xs text-gray-500 mt-1">{{ project.student.firstName }} {{ project.student.lastName }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-1.5">
                                    <div v-for="ch in 5" :key="ch" 
                                        :class="getChapterBadgeClass(project, ch)"
                                        class="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold border"
                                        :title="'บทที่ ' + ch">
                                        {{ ch }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <div class="w-20 bg-gray-100 rounded-full h-1.5">
                                        <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: calculateProgress(project) + '%' }"></div>
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-500">{{ calculateProgress(project) }}%</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const user = useCookie('user_data')
const projects = ref([])

const fetchProjects = async () => {
    if (!user.value?.id) return
    try {
        projects.value = await $fetch('/api/advisor/projects', { params: { advisorId: user.value.id } })
    } catch (e) { console.error('Error fetching projects') }
}

const updateProjectStatus = async (id, status) => {
    if (!confirm('ยืนยันการดำเนินการ?')) return
    try {
        await $fetch(`/api/advisor/projects/${id}`, { method: 'PUT', body: { status } })
        await fetchProjects()
    } catch (e) { alert('เกิดข้อผิดพลาด') }
}

const updateDocStatus = async (id, status) => {
    if (!confirm('ยืนยันสถานะการตรวจเอกสาร?')) return
    try {
        await $fetch('/api/advisor/documents', { method: 'PUT', body: { id, status } })
        await fetchProjects()
    } catch (e) { alert('เกิดข้อผิดพลาด') }
}

const pendingProjects = computed(() => projects.value.filter(p => p.status === 'PENDING'))
const approvedProjects = computed(() => projects.value.filter(p => p.status === 'APPROVED'))

const pendingDocsCount = computed(() => {
    let count = 0
    approvedProjects.value.forEach(p => {
        count += p.documents.filter(d => d.status === 'PENDING').length
    })
    return count
})

const getChapterBadgeClass = (project, chapter) => {
    const doc = project.documents.find(d => d.chapter === chapter)
    if (!doc) return 'bg-gray-50 text-gray-300 border-gray-100'
    if (doc.status === 'APPROVED') return 'bg-green-500 text-white border-green-600'
    if (doc.status === 'PENDING') return 'bg-yellow-400 text-white border-yellow-500 animate-pulse'
    if (doc.status === 'REJECTED') return 'bg-red-500 text-white border-red-600'
    return 'bg-gray-100 text-gray-400 border-gray-200'
}

const calculateProgress = (project) => {
    const approvedDocs = project.documents.filter(d => d.status === 'APPROVED').length
    return 40 + (approvedDocs * 10)
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('th-TH', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}

onMounted(() => fetchProjects())
</script>
