<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน (Students & Advisors)</h1>
                <p class="text-gray-500 mt-1">เพิ่ม แก้ไข หรือลบข้อมูลผู้ใช้งานในระบบ</p>
            </div>
            <button @click="openModal()"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                เพิ่มผู้ใช้งานใหม่
            </button>
        </div>

        <!-- ตารางแสดงรายชื่อผู้ใช้ -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-6 py-4 text-sm font-bold text-gray-700">ชื่อ-นามสกุล</th>
                            <th class="px-6 py-4 text-sm font-bold text-gray-700">อีเมล</th>
                            <th class="px-6 py-4 text-sm font-bold text-gray-700">สถานะ (Role)</th>
                            <th class="px-6 py-4 text-sm font-bold text-gray-700">วันที่สร้าง</th>
                            <th class="px-6 py-4 text-sm font-bold text-gray-700 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50/30 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                        {{ user.firstName.charAt(0) }}
                                    </div>
                                    <span class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                    user.role === 'SUPERADMIN' ? 'bg-purple-600 text-white' : 
                                    user.role === 'ADVISOR' ? 'bg-orange-100 text-orange-600' : 
                                    'bg-blue-100 text-blue-600'
                                ]">
                                    {{ user.role }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                                {{ new Date(user.createdAt).toLocaleDateString('th-TH') }}
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="openModal(user)" class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">แก้ไข</button>
                                <button @click="handleDelete(user.id)" class="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">ลบ</button>
                            </td>
                        </tr>
                        <tr v-if="users.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal สำหรับเพิ่ม/แก้ไข (อย่างง่าย) -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่' }}</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form @submit.prevent="saveUser" class="p-8 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="block text-sm font-semibold text-gray-700">ชื่อจริง</label>
                            <input v-model="form.firstName" type="text" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div class="space-y-1">
                            <label class="block text-sm font-semibold text-gray-700">นามสกุล</label>
                            <input v-model="form.lastName" type="text" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
                        <input v-model="form.email" type="email" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">รหัสผ่าน {{ isEditing ? '(เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)' : '' }}</label>
                        <input v-model="form.password" type="password" :required="!isEditing" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">บทบาท (Role)</label>
                        <select v-model="form.role" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="STUDENT">นักศึกษา (STUDENT)</option>
                            <option value="ADVISOR">อาจารย์ที่ปรึกษา (ADVISOR)</option>
                            <option value="SUPERADMIN">ผู้ดูแลระบบสูงสุด (SUPERADMIN)</option>
                        </select>
                    </div>

                    <div class="flex gap-3 pt-6">
                        <button type="button" @click="closeModal" class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">ยกเลิก</button>
                        <button type="submit" class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">บันทึกข้อมูล</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})

const users = ref([])
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentUserId = ref(null)

const form = ref({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT'
})

// ดึงข้อมูลผู้ใช้จาก API
const fetchUsers = async () => {
    try {
        users.value = await $fetch('/api/admin/users')
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    }
}

// เปิด Modal
const openModal = (user = null) => {
    if (user) {
        isEditing.value = true
        currentUserId.value = user.id
        form.value = {
            email: user.email,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    } else {
        isEditing.value = false
        currentUserId.value = null
        form.value = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'STUDENT'
        }
    }
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}

// บันทึกข้อมูล (Add/Update)
const saveUser = async () => {
    try {
        if (isEditing.value) {
            await $fetch(`/api/admin/users/${currentUserId.value}`, {
                method: 'PUT',
                body: form.value
            })
        } else {
            await $fetch('/api/admin/users', {
                method: 'POST',
                body: form.value
            })
        }
        alert('บันทึกข้อมูลสำเร็จ')
        closeModal()
        fetchUsers()
    } catch (error) {
        alert(error.data?.statusMessage || 'เกิดข้อผิดพลาด')
    }
}

// ลบผู้ใช้
const handleDelete = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) return
    
    try {
        await $fetch(`/api/admin/users/${id}`, {
            method: 'DELETE'
        })
        alert('ลบข้อมูลสำเร็จ')
        fetchUsers()
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    }
}

// โหลดข้อมูลเมื่อเปิดหน้า
onMounted(fetchUsers)
</script>
