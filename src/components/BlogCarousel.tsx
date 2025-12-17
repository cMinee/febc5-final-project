/** @format */

// ระบุให้คอมโพเนนต์นี้เป็น Client Component (ทำงานฝั่ง Client เท่านั้น)
"use client";

import { useState, useEffect } from "react"; // ใช้ useState สำหรับจัดการ state ภายในคอมโพเนนต์
import Image from "next/image"; // Image optimization ของ Next.js
import Link from "next/link"; // ใช้สำหรับสร้างลิงก์ไปยังหน้าบทความ
import type { Course } from "../app/db";

interface BlogCarouselProps {
  courses: Course[];
}

export default function BlogCarousel({ courses }: BlogCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const highlightedPosts = courses.slice(0, 6);

  // ป้องกัน hydration error โดยรอให้ component mount บน client ก่อน
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % highlightedPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [highlightedPosts.length, isMounted]);

  // ฟังก์ชันเลื่อนไปยังโพสต์ถัดไป
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % highlightedPosts.length);
  };

  // ฟังก์ชันเลื่อนไปยังโพสต์ก่อนหน้า
  const prevSlide = () => {
    setCurrentSlide(
      (currentSlide - 1 + highlightedPosts.length) % highlightedPosts.length
    );
  };

  return (
    <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-3xl shadow-soft-lg group">
      {highlightedPosts.map((post, index) => (
        <div
          key={post.id}
          className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={post.img || ''}
            alt={post.name}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Gradient overlay - ทำให้อ่านง่าย */}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/95 via-secondary-900/50 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-10 transform transition-transform duration-700">
            <div className="max-w-3xl">
              <div className="inline-block px-3 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-4">
                Featured Course
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
                {post.name}
              </h2>
              <p className="mb-6 text-secondary-100 text-base md:text-lg max-w-2xl line-clamp-2 leading-relaxed">
                {post.description}
              </p>
              <Link
                href={`/courses/${post.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-900 font-semibold rounded-xl hover:bg-primary-50 hover:shadow-soft-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>Explore Course</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 
                   bg-white/20 hover:bg-white/30 backdrop-blur-md 
                   text-white p-3 md:p-4 rounded-full 
                   transition-all duration-300 z-20 
                   opacity-0 group-hover:opacity-100
                   shadow-soft hover:shadow-soft-lg"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 
                   bg-white/20 hover:bg-white/30 backdrop-blur-md 
                   text-white p-3 md:p-4 rounded-full 
                   transition-all duration-300 z-20 
                   opacity-0 group-hover:opacity-100
                   shadow-soft hover:shadow-soft-lg"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {highlightedPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
