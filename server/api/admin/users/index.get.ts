import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        // 1. ดึงจากตาราง Admin (พวก Superadmin)
        const admins = await prisma.admin.findMany({
            orderBy: { createdAt: 'desc' }
        })
        const adminsWithRole = admins.map(admin => ({
            ...admin,
            role: 'SUPERADMIN'
        }))

        // 2. ดึงจากตาราง User (Student และ Advisor)
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        })

        // 3. เอามารวมกันและส่งกลับไปแสดงผล
        return [...adminsWithRole, ...users].sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้'
        })
    }
})
