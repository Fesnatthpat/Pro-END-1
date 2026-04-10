import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                advisor: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                documents: true,
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
