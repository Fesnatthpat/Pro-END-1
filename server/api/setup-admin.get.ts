import prisma from '~~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10)

        // 1. สร้าง Admin
        const admin = await prisma.admin.upsert({
            where: { email: 'admin@bsru.ac.th' },
            update: { password: hashedPassword },
            create: {
                email: 'admin@bsru.ac.th',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'System',
            },
        })

        // 2. สร้าง Advisor (อาจารย์ที่ปรึกษา)
        const advisor = await prisma.user.upsert({
            where: { email: 'advisor@bsru.ac.th' },
            update: { password: hashedPassword },
            create: {
                email: 'advisor@bsru.ac.th',
                password: hashedPassword,
                firstName: 'ดร.สมเจตน์',
                lastName: 'สายวิทย์',
                role: 'ADVISOR',
            },
        })

        // 3. สร้าง Student (นักศึกษา)
        const student = await prisma.user.upsert({
            where: { email: 'student@bsru.ac.th' },
            update: { password: hashedPassword },
            create: {
                email: 'student@bsru.ac.th',
                password: hashedPassword,
                firstName: 'สมบูรณ์',
                lastName: 'แบบดี',
                role: 'STUDENT',
            },
        })

        return { 
            status: 'success', 
            message: 'All users (Admin, Advisor, Student) created/updated with hashed passwords successfully',
            data: { admin, advisor, student }
        }
    } catch (error: any) {
        return { 
            status: 'error', 
            message: error.message 
        }
    }
})
