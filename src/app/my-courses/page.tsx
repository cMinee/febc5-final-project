"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import CourseItemLists from "@/components/CourseItemLists";
import { Course } from "@/app/db";
import { useRouter } from "next/navigation";

// Define Progress type locally if not available from client package
type Progress = {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
};

// Simplified Lesson type
type Lesson = {
  id: string;
  courseId: string;
  title: string;
};

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [learningCourses, setLearningCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Saved Courses
        const savedRes = await fetch(`/api/saved-courses?userId=${session.user.id}`);
        const savedData = await savedRes.json();
        setSavedCourses(Array.isArray(savedData) ? savedData : []);

        // 2. Fetch Progress
        const progressRes = await fetch(`/api/progress?userId=${session.user.id}`);
        const progressData: Progress[] = await progressRes.json();
        
        // 3. Fetch All Courses and Lessons to calculate learning progress
        // Ideally we should have a specific API for "enrolled courses", but we'll derive it.
        const allCoursesRes = await fetch("/api/admin/courses");
        const allCourses: Course[] = await allCoursesRes.json();

        // Find courses where user has at least one completed lesson
        const courseIdsWithProgress = new Set(progressData.filter(p => p.completed).map(p => {
           // We need to map lessonId to courseId. 
           // Since we don't have that direct link in progress easily without joining, 
           // we need to fetch lessons or check all courses.
           return null; // Placeholder, seeing logic issue here.
        }));

        // Better approach: Fetch all lessons to map lessonId -> courseId
        // This is heavy but works for small app.
        // Or we simply check which courses match the saved progress.
        
        // Let's rely on "All Courses" and map progress to them.
        const learning: Course[] = [];
        const newProgressMap: Record<string, number> = {};

        for (const course of allCourses) {
            // Fetch lessons for this course to calculate progress
            // Note: This makes N+1 requests, suboptimal but simplest without backend changes.
            const lessonsRes = await fetch(`/api/admin/courses/${course.id}/lessons`);
            const lessons: Lesson[] = await lessonsRes.json();
            
            if (lessons.length === 0) continue;

            const courseLessonIds = lessons.map(l => l.id);
            const completedCount = progressData.filter(p => 
                p.completed && courseLessonIds.includes(p.lessonId)
            ).length;

            if (completedCount > 0) {
                learning.push(course);
                newProgressMap[course.id] = Math.round((completedCount / lessons.length) * 100);
            }
        }

        setLearningCourses(learning);
        setProgressMap(newProgressMap);

      } catch (error) {
        console.error("Failed to fetch my courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-xl text-gray-600 mb-4">Please log in to view your courses</p>
          <button 
            onClick={() => router.push("/pages/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">My Courses</h1>

        {/* Currently Learning Section */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Continue Learning</h2>
            {loading ? (
                <p>Loading...</p>
            ) : learningCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {learningCourses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/courses/${course.id}`)}>
                             <div className="h-40 overflow-hidden relative">
                                <img src={course.img || ""} alt={course.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10"></div>
                             </div>
                             <div className="p-5">
                                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">{course.name}</h3>
                                
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="font-semibold text-blue-600">{progressMap[course.id]}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${progressMap[course.id]}%` }}
                                        ></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">You haven't started any courses yet.</p>
                    <button onClick={() => router.push('/courses')} className="mt-4 text-blue-600 hover:underline">Browse Courses</button>
                </div>
            )}
        </div>

        {/* Saved Courses Section */}
        <div>
             {loading ? (
                <p>Loading...</p>
            ) : (
                <CourseItemLists 
                    courses={savedCourses} 
                    title="Saved Courses"
                    hideSearch={true} 
                    disableSorting={true}
                />
            )}
            {!loading && savedCourses.length === 0 && (
                 <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">No saved courses.</p>
                </div>
            )}
        </div>

      </div>
    </Layout>
  );
}
