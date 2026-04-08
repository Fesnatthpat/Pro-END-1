import prisma from '~~/server/utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    // 1. รับข้อมูลจากหน้า Login
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'กรุณากรอกอีเมลและรหัสผ่าน' })
    }

    // 2. ค้นหาในตาราง Admin ก่อน (เพราะเป็นระบบคนละส่วนกัน)
    const admin = await prisma.admin.findUnique({
        where: { email: email }
    })

    if (admin) {
        // ตรวจสอบรหัสผ่านด้วย bcrypt.compare
        const isPasswordCorrect = await bcrypt.compare(password, admin.password)
        if (!isPasswordCorrect) {
            throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
        }

        // ถ้าเจอใน Admin ส่ง Role เป็น 'ADMIN' กลับไป
        return {
            message: 'เข้าสู่ระบบสำเร็จ (Admin)',
            user: {
                id: admin.id,
                email: admin.email,
                firstName: admin.firstName,
                role: 'ADMIN' 
            }
        }
    }

    // 3. ถ้าไม่เจอใน Admin ให้ค้นหาในตาราง User (STUDENT/ADVISOR)
    const user = await prisma.user.findUnique({
        where: { email: email }
    })

    if (user) {
        // ตรวจสอบรหัสผ่านด้วย bcrypt.compare
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
        }

        return {
            message: 'เข้าสู่ระบบสำเร็จ',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                role: user.role
            }
        }
    }

    // 4. ถ้าไม่เจอทั้งคู่
    throw createError({ statusCode: 401, statusMessage: 'ไม่พบผู้ใช้งานในระบบหรือรหัสผ่านไม่ถูกต้อง' })
})
