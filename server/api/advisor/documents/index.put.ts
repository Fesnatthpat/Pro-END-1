import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id, status, feedback } = body

    if (!id || !status) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ข้อมูลไม่ครบถ้วน'
        })
    }

    try {
        const doc = await prisma.document.update({
            where: { id },
            data: { 
                status,
                feedback 
            }
        })
        return doc
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถอัปเดตสถานะเอกสารได้'
        })
    }
})
