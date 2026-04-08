import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  
  // ชี้ไปยังไฟล์ CSS หลัก (ตรวจสอบว่าพาธไฟล์ถูกต้องตามโครงสร้างโปรเจ็กต์ของคุณ)
  css: ['./app/assets/css/main.css'],
  
  // การตั้งค่า Tailwind v4 ผ่าน Vite Plugin
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // โมดูลเสริมสำหรับเชื่อมต่อ Supabase
  modules: [
    '@nuxtjs/supabase'
  ],
  
  supabase: {
    // ปิดการ Redirect อัตโนมัติ เพื่อให้เราเช็ค Role (Admin/Student) เองในภายหลัง
    redirect: false 
  }
});