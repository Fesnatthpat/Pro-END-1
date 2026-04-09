import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const advisors = await prisma.user.findMany({
            where: {
                role: 'ADVISOR'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
            }
        })
        return advisors
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลอาจารย์ที่ปรึกษาได้'
        })
    }
})
