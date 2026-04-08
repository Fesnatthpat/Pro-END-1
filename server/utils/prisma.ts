import { PrismaClient } from '@prisma/client'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. ดึง URL ของฐานข้อมูลจากไฟล์ .env
const connectionString = process.env.DATABASE_URL

// 2. สร้าง Connection Pool ด้วยไลบรารี pg (ตัวกลาง)
const pool = new pg.Pool({ connectionString })

// 3. นำ Pool ไปใส่ใน Prisma Adapter
const adapter = new PrismaPg(pool)

// 4. สร้าง PrismaClient โดยบังคับให้ใช้ Adapter (กฎใหม่ของ Prisma 7)
const prisma = new PrismaClient({ adapter })

export default prisma