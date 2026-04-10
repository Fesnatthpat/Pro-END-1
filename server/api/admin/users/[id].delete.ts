import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ไม่พบรหัสผู้ใช้งาน'
        })
    }

    try {
        // 1. ลองลบจากตาราง Admin ก่อน (ถ้ามี)
        const admin = await prisma.admin.findUnique({ where: { id } })
        if (admin) {
            await prisma.admin.delete({ where: { id } })
            return { message: 'ลบผู้ดูแลระบบสำเร็จ' }
        }

        // 2. ถ้าไม่ใช่ Admin ให้จัดการลบจากตาราง User 
        // ต้องลบข้อมูลที่เกี่ยวข้องออกก่อนเนื่องจาก Foreign Key Constraint
        const user = await prisma.user.findUnique({ 
            where: { id },
            include: {
                projects: true, // สำหรับนักศึกษา
                advisedProjects: true // สำหรับอาจารย์
            }
        })

        if (!user) {
            throw createError({ statusCode: 404, statusMessage: 'ไม่พบผู้ใช้งาน' })
        }

        // รวมรหัสโครงการทั้งหมดที่เกี่ยวข้องกับผู้ใช้คนนี้ (ทั้งในฐานะนักศึกษาหรืออาจารย์)
        const projectIds = [
            ...user.projects.map(p => p.id),
            ...user.advisedProjects.map(p => p.id)
        ]

        if (projectIds.length > 0) {
            // ลบข้อมูลย่อยๆ ภายใต้โครงการก่อน
            await prisma.document.deleteMany({ where: { projectId: { in: projectIds } } })
            await prisma.consultation.deleteMany({ where: { projectId: { in: projectIds } } })
            // ลบตัวโครงการ
            await prisma.project.deleteMany({ where: { id: { in: projectIds } } })
        }

        // 3. ท้ายที่สุด ลบตัวผู้ใช้งาน
        await prisma.user.delete({
            where: { id }
        })

        return { message: 'ลบผู้ใช้งานและข้อมูลที่เกี่ยวข้องสำเร็จ' }
    } catch (error: any) {
        console.error('Delete error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: `ไม่สามารถลบข้อมูลผู้ใช้ได้: ${error.message}`
        })
    }
})
