"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Course } from "@prisma/client";

export default function CourseItemLists() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [onlineCourses, setOnlineCourses] = useState<Course[]>([]);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/courses");
            const data = await response.json();
            setOnlineCourses(Array.isArray(data) ? data : []);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setOnlineCourses([]);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCourses(); 
    }, []);

    const filteredCourses = onlineCourses.filter((course) =>
        (course.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const highlightMatch = (text: string, searchQuery: string) => {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        return text.replace(regex, `<span class="bg-accent-200 text-accent-800 font-medium">$1</span>`);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(selectedCategory === category ? "" : category);
    };

    const selectedCourses = selectedCategory
        ? onlineCourses.filter(course => course.category === selectedCategory)
        : onlineCourses;

    const categories = Array.from(new Set(onlineCourses.map(course => course.category)));

    return (
        <div className="w-full">
            {/* Search Section */}
            <div className="mb-8">
                <div className="relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search for courses..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-2xl 
                                   focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent 
                                   text-secondary-900 placeholder-secondary-400 text-base shadow-soft
                                   transition-all duration-200 hover:shadow-soft-lg"
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchQuery && (
                    <div className="absolute z-30 bg-white/95 backdrop-blur-xl shadow-soft-lg rounded-2xl max-w-2xl mt-2 border border-secondary-100 overflow-hidden">
                        {filteredCourses.length > 0 ? (
                            <div className="max-h-96 overflow-y-auto">
                                {filteredCourses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        className="p-4 border-b border-secondary-100 last:border-0 cursor-pointer hover:bg-primary-50 transition-colors duration-200" 
                                        onClick={() => window.location.href = `/courses/${course.id}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-soft">
                                                <Image 
                                                    src={course.img} 
                                                    alt={course.name} 
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p 
                                                    className="font-semibold text-secondary-900 mb-1" 
                                                    dangerouslySetInnerHTML={{ __html: highlightMatch(course.name, searchQuery) }} 
                                                />
                                                <p className="text-sm text-secondary-500 line-clamp-1">{course.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 bg-secondary-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-secondary-600 font-medium">No courses found</p>
                                <p className="text-sm text-secondary-400 mt-1">Try searching with different keywords</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-4">Filter by Category</h3>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 
                                    ${selectedCategory === category 
                                        ? 'bg-primary-500 text-white shadow-soft-lg transform scale-105' 
                                        : 'bg-white/80 backdrop-blur-sm text-secondary-700 border border-secondary-200 hover:border-primary-300 hover:shadow-soft hover:bg-primary-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory("")}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-all duration-200"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Course List Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-display font-bold text-secondary-900">
                    {selectedCategory ? `${selectedCategory} Courses` : 'All Courses'}
                </h2>
                <span className="text-sm text-secondary-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary-200">
                    {selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'}
                </span>
            </div>

            {/* Course Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative w-16 h-16 mb-4">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-secondary-600 font-medium">Loading courses...</p>
                </div>
            ) : selectedCourses.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-12 text-center border border-secondary-100">
                    <div className="w-20 h-20 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">No courses available</h3>
                    <p className="text-secondary-500">Check back later for new courses</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {selectedCourses.map((course) => (
                        <div 
                            key={course.id} 
                            className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-soft-lg 
                                       overflow-hidden cursor-pointer transition-all duration-300 
                                       hover:transform hover:scale-[1.02] border border-secondary-100/50
                                       flex flex-col h-full"
                            onClick={() => window.location.href = `/courses/${course.id}`}
                        >
                            {/* Course Image */}
                            <div className="relative w-full h-52 overflow-hidden bg-secondary-100">
                                <Image 
                                    src={course.img} 
                                    alt={course.name} 
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Course Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    {course.category && (
                                        <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-3 border border-primary-200">
                                            {course.category}
                                        </span>
                                    )}
                                    <h3 className="text-xl font-display font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-secondary-600 line-clamp-3 leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <button 
                                    className="mt-5 w-full px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 
                                               text-white font-semibold rounded-xl
                                               hover:from-primary-600 hover:to-primary-700 
                                               hover:shadow-soft-lg
                                               transition-all duration-300
                                               flex items-center justify-center gap-2
                                               group-hover:transform group-hover:translate-y-[-2px]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `/courses/${course.id}`;
                                    }}
                                >
                                    <span>Learn More</span>
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))} 
                </div>  
            )}
        </div>
    )
}