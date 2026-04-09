import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { titleTh, titleEn, description, advisorId, studentId } = body

    if (!titleTh || !titleEn || !advisorId || !studentId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        })
    }

    try {
        // ตรวจสอบว่านักศึกษามีโครงงานอยู่แล้วหรือไม่ (1 คน 1 โครงงาน)
        const existingProject = await prisma.project.findFirst({
            where: { studentId }
        })

        if (existingProject) {
            throw createError({
                statusCode: 400,
                statusMessage: 'คุณได้เสนอหัวข้อโครงงานไปแล้ว'
            })
        }

        const project = await prisma.project.create({
            data: {
                titleTh,
                titleEn,
                description,
                advisorId,
                studentId,
                status: 'PENDING'
            }
        })
        return project
    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถบันทึกข้อมูลโครงงานได้'
        })
    }
})
