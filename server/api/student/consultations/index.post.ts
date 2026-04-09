import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { topic, details, projectId, date } = body

    if (!topic || !projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'กรุณากรอกหัวข้อและรหัสโครงงานให้ครบถ้วน'
        })
    }

    try {
        // ตรวจสอบความถูกต้องของวันที่ก่อนบันทึก
        let consultationDate = new Date()
        if (date) {
            consultationDate = new Date(date)
            // เช็คว่าถ้าเป็น Invalid Date ให้ใช้วันที่ปัจจุบันแทน
            if (isNaN(consultationDate.getTime())) {
                consultationDate = new Date()
            }
        }

        const consultation = await prisma.consultation.create({
            data: {
                topic,
                details,
                projectId,
                date: consultationDate
            }
        })
        return consultation
    } catch (error: any) {
        console.error('Prisma Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `ไม่สามารถบันทึกข้อมูลได้: ${error.message || 'ข้อผิดพลาดภายในระบบ'}`
        })
    }
})
