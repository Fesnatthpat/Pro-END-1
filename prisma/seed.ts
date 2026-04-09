import 'dotenv/config'
import prisma from '../server/utils/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('--- เริ่มการเพิ่มข้อมูล (Seeding) ---')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. เพิ่มข้อมูล Admin
  await prisma.admin.upsert({
    where: { email: 'admin@bsru.ac.th' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@bsru.ac.th',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
    },
  })

  // 2. เพิ่มข้อมูลนักศึกษา
  await prisma.user.upsert({
    where: { email: 'student@bsru.ac.th' },
    update: { password: hashedPassword },
    create: {
      email: 'student@bsru.ac.th',
      password: hashedPassword,
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      role: 'STUDENT',
    },
  })

  // 3. เพิ่มรายชื่ออาจารย์ที่ปรึกษา (Advisors)
  const advisors = [
    { email: 'somsri@bsru.ac.th', firstName: 'ดร.สมศรี', lastName: 'เรียนเก่ง' },
    { email: 'somchai_t@bsru.ac.th', firstName: 'ผศ.สมชาย', lastName: 'ทวีคูณ' },
    { email: 'wichai@bsru.ac.th', firstName: 'อ.วิชัย', lastName: 'ใฝ่รู้' },
    { email: 'kanya@bsru.ac.th', firstName: 'ดร.กัญญา', lastName: 'รักษาดี' },
  ]

  for (const adv of advisors) {
    await prisma.user.upsert({
      where: { email: adv.email },
      update: { password: hashedPassword },
      create: {
        email: adv.email,
        password: hashedPassword,
        firstName: adv.firstName,
        lastName: adv.lastName,
        role: 'ADVISOR',
      },
    })
  }
  
  console.log('--- เพิ่มรายชื่ออาจารย์และข้อมูลตัวอย่างสำเร็จ ---')
}

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
