/** @format */

// ระบุให้คอมโพเนนต์นี้เป็น Client Component (ทำงานฝั่ง Client เท่านั้น)
"use client";

import { useState } from "react"; // ใช้ useState สำหรับจัดการ state ภายในคอมโพเนนต์
import Image from "next/image"; // mage optimization ของ Next.js
import Link from "next/link"; // ใช้สำหรับสร้างลิงก์ไปยังหน้าบทความ
import { onlineCourses } from "../lib/online-course"; // นำเข้าข้อมูล onlineCourses (สมมุติว่าเก็บข้อมูลบทความในที่เดียว)

export default function BlogCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0); // state สำหรับเก็บ index ของโพสต์ที่กำลังแสดง
  const highlightedPosts = onlineCourses.slice(0, 6); // เลือกเฉพาะ 6 โพสต์แรกมาแสดงใน carousel

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
    <div className="relative w-full h-96 overflow-hidden">
      {highlightedPosts.map((post, index) => (
        <div
          key={post.id} // กำหนด key เพื่อป้องกันปัญหาเกี่ยวกับการเรนเดอร
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0" // ถ้าโพสต์ปัจจุบันตรงกับ state จะมีค่า opacity 100%
          }`}
        >
          {/* <Image
            src={post.featureImage} // URL ของรูปภาพโพสต
            alt={post.name}
            layout="fill"
            objectFit="cover"
          /> */}
           {/* ส่วนเนื้อหาโพสต์ที่แสดงทับอยู่บนรูปภาพ */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h2 className="text-2xl font-bold mb-2">{post.name}</h2>
            <p className="mb-2">{post.description}</p> {/* คำโปรยของโพสต์ */}
            <Link
              href={`/blog/${post.id}`} // ลิงก์ไปยังหน้ารายละเอียดของโพสต
              className="text-blue-300 hover:underline"
            >
              Read more
            </Link>
          </div>
        </div>
      ))}
      {/* ปุ่มเลื่อนไปยังโพสต์ก่อนหน้า */}
      <button
        onClick={prevSlide} // เรียกฟังก์ชันเลื่อนกลับ
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        &#10094; {/* สัญลักษณ์ลูกศรย้อนกลับ */}
      </button>

       {/* ปุ่มเลื่อนไปยังโพสต์ถัดไป */}
      <button
        onClick={nextSlide} // เรียกฟังก์ชันเลื่อนไปข้างหน้า
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        &#10095; {/* สัญลักษณ์ลูกศรไปข้างหน้า */}
      </button>
    </div>
  );
}
