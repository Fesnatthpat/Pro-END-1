import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const projectId = query.projectId as string

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ไม่พบรหัสโครงงาน'
        })
    }

    try {
        const consultations = await prisma.consultation.findMany({
            where: {
                projectId: projectId
            },
            orderBy: {
                date: 'desc'
            }
        })
        return consultations
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลการปรึกษาได้'
        })
    }
})
