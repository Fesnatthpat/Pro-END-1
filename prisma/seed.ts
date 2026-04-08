import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- เริ่มการเพิ่มข้อมูล (Seeding) ---')

  // 1. เพิ่มข้อมูล Admin คนแรก
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@bsru.ac.th' },
    update: {},
    create: {
      email: 'admin@bsru.ac.th',
      password: 'password123', // รหัสผ่านตั้งต้น
      firstName: 'Admin',
      lastName: 'System',
    },
  })

  console.log(`เพิ่ม Admin สำเร็จ: ${admin.email}`)
  
  // 2. เพิ่มข้อมูลนักศึกษาตัวอย่าง
  const student = await prisma.user.upsert({
    where: { email: 'student@bsru.ac.th' },
    update: {},
    create: {
      email: 'student@bsru.ac.th',
      password: 'password123',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      role: 'STUDENT',
    },
  })
  
  console.log(`เพิ่ม Student สำเร็จ: ${student.email}`)
  console.log('--- เสร็จสิ้นการเพิ่มข้อมูล ---')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
