import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const studentId = query.studentId as string

    if (!studentId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ไม่พบรหัสนักศึกษา'
        })
    }

    try {
        const project = await prisma.project.findFirst({
            where: {
                studentId: studentId
            },
            include: {
                advisor: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return project
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลโครงงานได้'
        })
    }
})
