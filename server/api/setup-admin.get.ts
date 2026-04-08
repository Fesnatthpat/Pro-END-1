import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        // 1. เช็คก่อนว่ามีอีเมล admin นี้ในระบบหรือยัง
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@bsru.ac.th' }
        })

        if (existingAdmin) {
            return { 
                status: 'success', 
                message: 'มีบัญชี Admin นี้อยู่ในระบบแล้วครับ สามารถไปล็อกอินได้เลย!', 
                user: existingAdmin 
            }
        }

        // 2. ถ้ายังไม่มี ให้ใช้ Prisma สร้าง User ใหม่
        const newAdmin = await prisma.user.create({
            data: {
                email: 'admin@bsru.ac.th',
                password: 'password123', // รหัสผ่านชั่วคราวสำหรับทดสอบ
                firstName: 'ผู้ดูแลระบบ',
                lastName: 'สูงสุด',
                role: 'ADMIN' // กำหนดสิทธิ์เป็นแอดมิน
            }
        })

        return { 
            status: 'success', 
            message: 'สร้างบัญชี Admin สำเร็จเรียบร้อย!', 
            user: newAdmin 
        }

    } catch (error) {
        console.error("Setup Admin Error:", error)
        throw createError({
            statusCode: 500,
            statusMessage: 'เกิดข้อผิดพลาดในการสร้างฐานข้อมูล'
        })
    }
})