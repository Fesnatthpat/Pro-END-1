import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { fileName, fileUrl, chapter, projectId } = body

    if (!fileName || !chapter || !projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ข้อมูลไม่ครบถ้วน'
        })
    }

    try {
        // ลบข้อมูลเดิมของบทเดียวกัน (ถ้ามี) เพื่อให้บทที่ 1 มีเพียง 1 ไฟล์ล่าสุด
        await prisma.document.deleteMany({
            where: {
                projectId,
                chapter: parseInt(chapter)
            }
        })

        const doc = await prisma.document.create({
            data: {
                fileName,
                fileUrl: fileUrl || 'dummy_url',
                chapter: parseInt(chapter),
                projectId,
                status: 'PENDING'
            }
        })
        return doc
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'ไม่สามารถบันทึกข้อมูลเอกสารได้'
        })
    }
})
