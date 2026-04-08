import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        
        // ลองลบจากตาราง Admin ก่อน
        const isAdmin = await prisma.admin.findUnique({ where: { id } })
        if (isAdmin) {
            await prisma.admin.delete({ where: { id } })
            return { message: 'ลบผู้ดูแลระบบสำเร็จ' }
        }

        // ถ้าไม่ใช่ Admin ให้ลบจากตาราง User
        await prisma.user.delete({
            where: { id }
        })

        return { message: 'ลบผู้ใช้งานสำเร็จ' }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `ไม่สามารถลบข้อมูลผู้ใช้ได้: ${error.message}`
        })
    }
})
