"use client";

import { useState } from "react";
import { onlineCourses } from "../lib/online-course"; // นำเข้าข้อมูล onlineCourses (สมมุติว่าเก็บข้อมูลบทความในที่เดียว)
import Image from "next/image";

export default function CourseItemLists() {
    const [searchQuery, setSearchQuery] = useState(""); // สร้าง state สำหรับค้นหา

    const filteredCourses = onlineCourses.filter((course) =>
        (course.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const highlightMatch = (text: string, searchQuery: string) => {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        return text.replace(regex, `<span class="bg-yellow-200">$1</span>`);
    };

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
                {onlineCourses.map((course) => (
                    <div key={course.id} className="flex items-center mr-4">
                        <a href="#" className="text-center text-gray-600 bg-white px-3 py-1 rounded-full my-2">{course.category}</a>
                    </div>
                ))}
            </div>

            {/* show course item */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {onlineCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow-md p-4">
                        <Image src={course.img} alt={course.name} width={600} height={400} className="w-full h-48 object-cover rounded-t-lg" />
                        <h2 className="text-xl font-semibold mt-2">{course.name}</h2>
                        <p className="text-gray-600">{course.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}