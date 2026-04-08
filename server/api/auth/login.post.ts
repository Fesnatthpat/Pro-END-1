import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // 1. รับข้อมูลจากหน้า Login
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'กรุณากรอกอีเมลและรหัสผ่าน' })
    }

    // 2. ค้นหา User ในฐานข้อมูลด้วย Prisma
    const user = await prisma.user.findUnique({
        where: { email: email }
    })

    // 3. ถ้าไม่เจออีเมล หรือ รหัสผ่านไม่ตรงกัน
    if (!user || user.password !== password) {
        throw createError({ statusCode: 401, statusMessage: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองใหม่อีกครั้ง' })
    }

    // 4. ถ้าถูกต้องทั้งหมด ส่งข้อมูลกลับไปให้หน้าเว็บ
    return {
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            role: user.role
        }
    }
})