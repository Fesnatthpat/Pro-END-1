import prisma from '~~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        // 1. ถ้ามีการส่งรหัสผ่านมา ให้ Hash ก่อน
        let hashedPassword = undefined
        if (body.password) {
            hashedPassword = await bcrypt.hash(body.password, 10)
        }

        // 2. ตรวจสอบก่อนว่า ID นี้อยู่ในตารางไหน (Admin หรือ User)
        // เริ่มจากเช็คใน Admin
        const isAdmin = await prisma.admin.findUnique({ where: { id } })

        if (isAdmin) {
            // ถ้าเป็น Admin แต่ Role ใหม่ไม่ใช่ SUPERADMIN (เปลี่ยนคนจาก Admin เป็น User ปกติ)
            if (body.role !== 'SUPERADMIN') {
                // ลบจาก Admin แล้วไปสร้างใน User
                const deletedAdmin = await prisma.admin.delete({ where: { id } })
                return await prisma.user.create({
                    data: {
                        email: body.email,
                        password: hashedPassword || deletedAdmin.password,
                        firstName: body.firstName,
                        lastName: body.lastName,
                        role: body.role
                    }
                })
            }

            // ถ้ายังเป็น SUPERADMIN เหมือนเดิม ก็แค่ Update ตาราง Admin
            return await prisma.admin.update({
                where: { id },
                data: {
                    email: body.email,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    ...(hashedPassword && { password: hashedPassword })
                }
            })
        }

        // 3. ถ้าไม่ได้อยู่ใน Admin ให้หาในตาราง User
        const isUser = await prisma.user.findUnique({ where: { id } })

        if (isUser) {
            // ถ้าเปลี่ยน Role เป็น SUPERADMIN
            if (body.role === 'SUPERADMIN') {
                const deletedUser = await prisma.user.delete({ where: { id } })
                return await prisma.admin.create({
                    data: {
                        email: body.email,
                        password: hashedPassword || deletedUser.password,
                        firstName: body.firstName,
                        lastName: body.lastName
                    }
                })
            }

            // ถ้ายังเป็น Student/Advisor เหมือนเดิม
            return await prisma.user.update({
                where: { id },
                data: {
                    email: body.email,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    role: body.role,
                    ...(hashedPassword && { password: hashedPassword })
                }
            })
        }

        throw createError({ statusCode: 404, statusMessage: 'ไม่พบผู้ใช้งาน' })

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้: ${error.message}`
        })
    }
})
