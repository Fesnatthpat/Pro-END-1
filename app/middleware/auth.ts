export default defineNuxtRouteMiddleware((to) => {
    // 1. ดึงข้อมูลจาก Cookie 'user_data'
    const user = useCookie<any>('user_data').value

    // 2. ถ้ายังไม่ได้ล็อกอิน แล้วพยายามเข้าหน้าอื่นที่ไม่ใช่หน้า /login
    if (!user && to.path !== '/login') {
        return navigateTo('/login')
    }

    // 3. ถ้าล็อกอินแล้ว แต่พยายามเข้าหน้า /login อีกครั้ง ให้ดีดไป Dashboard
    if (user && to.path === '/login') {
        return navigateTo(getDashboardPath(user.role))
    }

    // 4. ตรวจสอบสิทธิ์การเข้าถึง (Authorization)
    if (user) {
        const role = user.role
        const path = to.path

        // กรณีเป็น STUDENT หรืออื่นๆ แต่จะเข้า /admin
        if (path.startsWith('/admin') && role !== 'ADMIN' && role !== 'SUPERADMIN') {
            return navigateTo(getDashboardPath(role))
        }

        // กรณีเป็น STUDENT แต่จะเข้า /advisor
        if (path.startsWith('/advisor') && role !== 'ADVISOR') {
            return navigateTo(getDashboardPath(role))
        }

        // กรณีหน้า STUDENT แต่ ADMIN หรือ ADVISOR เข้ามา (ถ้าไม่ต้องการให้เข้า)
        if (path.startsWith('/student') && role !== 'STUDENT') {
            return navigateTo(getDashboardPath(role))
        }
    }
})

// ฟังก์ชันช่วยหา Path ของ Dashboard ตาม Role
function getDashboardPath(role: string) {
    switch (role) {
        case 'ADMIN': return '/admin/dashboard'
        case 'STUDENT': return '/student/dashboard'
        case 'ADVISOR': return '/advisor/dashboard'
        default: return '/'
    }
}
