"use client";

import { useState } from "react";
import { onlineCourses } from "../lib/online-course"; // นำเข้าข้อมูล onlineCourses (สมมุติว่าเก็บข้อมูลบทความในที่เดียว)

export default function CourseItemLists() {
    const [searchQuery, setSearchQuery] = useState(""); // สร้าง state สำหรับค้นหา

    const filteredCourses = onlineCourses.filter((course) =>
        (course.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (course.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto py-8">
            {/* search course by name or description */}
            <div className="flex justify-start mb-8">
                <input type="text" placeholder="Search course" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
                <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Search</button>
            </div>
            {/* แสดงรายการคอร์ส */}
            {/* เปลี่ยนให้เป็นแบบคล้ายๆ mid project */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md p-4">
                            <img
                                src={course.img}
                                alt={course.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <h2 className="text-xl font-semibold mt-2">{course.name}</h2>
                            <p className="text-gray-600">{course.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-4">No courses found.</p>
                )}
            </div> */}

            {/* show item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {onlineCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow-md p-4">
                        <img src={course.img} alt={course.name} className="w-full h-48 object-cover rounded-t-lg" />
                        <h2 className="text-xl font-semibold mt-2">{course.name}</h2>
                        <p className="text-gray-600">{course.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}