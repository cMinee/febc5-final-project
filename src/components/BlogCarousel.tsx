/** @format */

// ระบุให้คอมโพเนนต์นี้เป็น Client Component (ทำงานฝั่ง Client เท่านั้น)
"use client";

import { useState } from "react"; // ใช้ useState สำหรับจัดการ state ภายในคอมโพเนนต์
import Image from "next/image"; // mage optimization ของ Next.js
import Link from "next/link"; // ใช้สำหรับสร้างลิงก์ไปยังหน้าบทความ
import type { Course } from "../app/db";

interface BlogCarouselProps {
  courses: Course[];
}

export default function BlogCarousel({ courses }: BlogCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0); // state สำหรับเก็บ index ของโพสต์ที่กำลังแสดง
  const highlightedPosts = courses.slice(0, 6); // เลือกเฉพาะ 6 โพสต์แรกมาแสดงใน carousel

  // ฟังก์ชันเลื่อนไปยังโพสต์ถัดไป
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % highlightedPosts.length); // ถ้าถึงโพสต์สุดท้ายให้วนกลับไปโพสต์แรก
  };

  // ฟังก์ชันเลื่อนไปยังโพสต์ก่อนหน้า
  const prevSlide = () => {
    setCurrentSlide(
      (currentSlide - 1 + highlightedPosts.length) % highlightedPosts.length // วนกลับไปโพสต์สุดท้ายถ้าอยู่ที่โพสต์แรก
    );
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      {highlightedPosts.map((post, index) => (
        <div
          key={post.id} // กำหนด key เพื่อป้องกันปัญหาเกี่ยวกับการเรนเดอร
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0" // ถ้าโพสต์ปัจจุบันตรงกับ state จะมีค่า opacity 100%
          }`}
        >
          {/* หากรูปภาพนี้อยู่ด้านบนของหน้าจอและเป็นภาพสำคัญ (เช่น Hero Image) ให้เพิ่ม priority เพื่อให้โหลดเร็วขึ้น: */}
          {/* ถ้ารูปภาพอยู่ล่างๆ หน้า (ต้อง Scroll ถึงจะเห็น) สามารถ ละเว้น priority ได้ (ไม่ต้องแก้ไขอะไร) แต่ถ้ายังต้องการปรับปรุงประสิทธิภาพ สามารถเพิ่ม loading="lazy"*/}
          <Image
            src={post.img || ''} // URL ของรูปภาพโพสต
            alt={post.name}
            fill
            className="object-cover"
            priority
          />
           {/* ส่วนเนื้อหาโพสต์ที่แสดงทับอยู่บนรูปภาพ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">{post.name}</h2>
            <p className="mb-6 text-gray-200 text-sm md:text-lg max-w-2xl line-clamp-2">{post.description}</p> {/* คำโปรยของโพสต์ */}
            <Link
              href={`/courses/${post.id}`} // ลิงก์ไปยังหน้ารายละเอียดของโพสต
              className="inline-block px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg"
            >
              Read more
            </Link>
          </div>
        </div>
      ))}
      {/* ปุ่มเลื่อนไปยังโพสต์ก่อนหน้า */}
      <button
        onClick={prevSlide} // เรียกฟังก์ชันเลื่อนกลับ
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full transition-all z-20"
      >
        &#10094; {/* สัญลักษณ์ลูกศรย้อนกลับ */}
      </button>

       {/* ปุ่มเลื่อนไปยังโพสต์ถัดไป */}
      <button
        onClick={nextSlide} // เรียกฟังก์ชันเลื่อนไปข้างหน้า
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full transition-all z-20"
      >
        &#10095; {/* สัญลักษณ์ลูกศรไปข้างหน้า */}
      </button>
    </div>
  );
}
