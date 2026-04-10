import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const advisorId = query.advisorId as string

    if (!advisorId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ไม่พบรหัสอาจารย์'
        })
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                advisorId: advisorId
            },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                documents: {
                    orderBy: {
                        chapter: 'asc'
                    }
                },
                history: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return projects
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลโครงงานได้'
        })
    }
})
