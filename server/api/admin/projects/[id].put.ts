import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, feedback } = body

    if (!id || !status) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ข้อมูลไม่ครบถ้วน'
        })
    }

    try {
        const project = await prisma.project.update({
            where: { id },
            data: { 
                status,
                feedback: feedback || null // บันทึกเหตุผลถ้ามี
            }
        })
        return project
    } catch (error: any) {
        console.error('Update error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `ไม่สามารถอัปเดตสถานะโครงงานได้: ${error.message}`
        })
    }
})
