"use client";

import { useState } from "react";
import { onlineCourses } from "../app/lib/online-course"; // นำเข้าข้อมูล onlineCourses (สมมุติว่าเก็บข้อมูลบทความในที่เดียว)
import Image from "next/image";

export default function CourseItemLists() {
    const [searchQuery, setSearchQuery] = useState(""); // สร้าง state สำหรับค้นหา
    const [selectedCategory, setSelectedCategory] = useState(""); // สร้าง state สำหรับเลือกหมวดหมู่


    const filteredCourses = onlineCourses.filter((course) =>
        (course.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const highlightMatch = (text: string, searchQuery: string) => {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        return text.replace(regex, `<span class="bg-yellow-200">$1</span>`);
    };

    const handleCategoryChange = (category: string) => {
        // ถ้ากด Category เดิม → รีเซ็ตเป็นทั้งหมด
        setSelectedCategory(selectedCategory === category ? "" : category);
    };

    const selectedCourses = selectedCategory
        ? onlineCourses.filter(course => course.category === selectedCategory)
        : onlineCourses;

    return (
        <div className="container mx-auto py-8">
            {/* start search course by name */}
            <div className="flex justify-start mb-8">
                <input type="text" placeholder="Search course" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-3/4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
                {/* <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Search</button> */}
            </div>
            {/* แสดงรายการคอร์ส */}
            {/* เปลี่ยนให้เป็นแบบคล้ายๆ mid project */}
            {searchQuery && (
                <div id="search-results" className="absolute bg-white shadow-md rounded-md w-3/4 mt-2 z-10">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course.id} className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                    <Image src={course.img} alt={course.name} width={80} height={80} className="rounded-md mr-4" />
                                    <div>
                                        <p className="font-medium text-gray-600" dangerouslySetInnerHTML={{ __html: highlightMatch(course.name, searchQuery) }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-gray-500">No courses found.</p>
                    )}
                </div>
            )}
            {/* End search course by name */}

            {/* start category course */}
            <div className="flex flex-wrap justify-start mb-8">
                {Array.from(new Set(onlineCourses.map(course => course.category))) // ดึงค่า category ที่ไม่ซ้ำกัน
                    .map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`text-center px-3 py-1 rounded-full my-2 mr-4 border cursor-pointer
                                ${selectedCategory === category ? "bg-white text-gray-600 [box-shadow:0_0_10px_#00ff00,0_0_20px_#00ff00]" : "bg-white text-gray-600"}`}
                            >{category}
                        </button>
                    ))}
            </div>

            {/* show course item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow-md p-4 cursor-pointer" onClick={() => window.location.href = `/courses/${course.id}`}>
                        <Image src={course.img} alt={course.name} width={600} height={400} className="w-full h-48 object-cover rounded-t-lg" />
                        <h2 className="text-xl font-semibold mt-2 text-gray-600">{course.name}</h2>
                        <p className="text-gray-600">{course.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}