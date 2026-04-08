import prisma from '~~/server/utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        
        // 1. ตรวจสอบข้อมูลเบื้องต้น
        if (!body.email || !body.password || !body.firstName || !body.lastName || !body.role) {
            throw createError({
                statusCode: 400,
                statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            })
        }

        // 2. Hash รหัสผ่านก่อนบันทึก
        const hashedPassword = await bcrypt.hash(body.password, 10)

        // 3. แยกบันทึกตามตาราง
        if (body.role === 'SUPERADMIN') {
            // บันทึกลงตาราง Admin
            const newAdmin = await prisma.admin.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    firstName: body.firstName,
                    lastName: body.lastName
                }
            })
            return { ...newAdmin, role: 'SUPERADMIN' }
        } else {
            // บันทึกลงตาราง User (STUDENT/ADVISOR)
            const newUser = await prisma.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    role: body.role
                }
            })
            return newUser
        }

    } catch (error: any) {
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 400,
                statusMessage: 'อีเมลนี้ถูกใช้งานไปแล้ว'
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: `เกิดข้อผิดพลาดในการสร้างผู้ใช้: ${error.message}`
        })
    }
})
