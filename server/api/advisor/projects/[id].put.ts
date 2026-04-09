import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status } = body

    if (!id || !status) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ข้อมูลไม่ครบถ้วน'
        })
    }

    try {
        const project = await prisma.project.update({
            where: { id },
            data: { status }
        })
        return project
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถอัปเดตสถานะโครงงานได้'
        })
    }
})
