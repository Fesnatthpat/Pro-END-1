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
        // ตรวจสอบว่านักศึกษามีโครงงานอยู่แล้วหรือไม่
        const existingProject = await prisma.project.findFirst({
            where: { studentId }
        })

        if (existingProject) {
            // ถ้ายอมให้เสนอใหม่ได้เฉพาะกรณีที่ถูก REJECTED เท่านั้น
            if (existingProject.status === 'REJECTED') {
                // 1. เก็บประวัติลงตาราง ProjectHistory ก่อน
                await prisma.projectHistory.create({
                    data: {
                        projectId: existingProject.id,
                        titleTh: existingProject.titleTh,
                        titleEn: existingProject.titleEn,
                        description: existingProject.description,
                        status: existingProject.status,
                        feedback: existingProject.feedback
                    }
                })

                // 2. อัปเดตโครงงานเดิม แทนการสร้างใหม่
                const updatedProject = await prisma.project.update({
                    where: { id: existingProject.id },
                    data: {
                        titleTh,
                        titleEn,
                        description,
                        advisorId,
                        status: 'PENDING', // กลับไปเป็นรออนุมัติ
                        feedback: null    // ล้างเหตุผลเดิมออก
                    }
                })
                return updatedProject
            }

            throw createError({
                statusCode: 400,
                statusMessage: 'คุณได้เสนอหัวข้อโครงงานไปแล้วและอยู่ระหว่างรอดำเนินการหรืออนุมัติแล้ว'
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
        console.error('Project Submit error:', error)
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: `ไม่สามารถบันทึกข้อมูลโครงงานได้: ${error.message}`
        })
    }
})
