"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { Course, Lesson } from "../../db";

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-');
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params?.id;
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course>({} as Course);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const [duration, setDuration] = useState<number | null>(null);
  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch(() => setCourse({} as Course))
      .finally(() => setLoading(false));
  }, [courseId]);

  const fetchLessons = async () => {
    const res = await fetch(`/api/admin/courses/${courseId}/lessons`);
    const data = await res.json();
    setLessons(data);
  };

  useEffect(() => {
    fetchLessons()
  }, [courseId]);

  // ตรวจสอบว่า course นี้ถูก save ไว้แล้วหรือยัง
  const checkIfSaved = async () => {
    if (!session?.user?.id || !courseId) return;
    
    try {
      const res = await fetch(`/api/saved-courses?userId=${session.user.id}`);
      const savedCourses = await res.json();
      const saved = savedCourses.some((c: any) => c.id === courseId);
      setIsSaved(saved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  useEffect(() => {
    checkIfSaved();
  }, [session, courseId]);

  // Save course
  const handleSaveCourse = async () => {
    if (!session?.user?.id) {
      alert("Please login to save courses");
      router.push("/pages/login");
      return;
    }

    setSavingCourse(true);
    try {
      const res = await fetch("/api/saved-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          courseId: courseId,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course");
    } finally {
      setSavingCourse(false);
    }
  };

  // Unsave course
  const handleUnsaveCourse = async () => {
    if (!session?.user?.id) return;

    setSavingCourse(true);
    try {
      const res = await fetch(
        `/api/saved-courses?userId=${session.user.id}&courseId=${courseId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error unsaving course:", error);
      alert("Failed to unsave course");
    } finally {
      setSavingCourse(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-xl">
          <img
            src={course.img}
            alt={course.name}
            className="object-cover w-full h-full rounded-xl"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-10 text-white">
            <button 
              className="text-lg md:text-xl font-semibold px-8 py-3 bg-secondary hover:bg-opacity-90 text-white rounded-full transition-transform hover:scale-105 shadow-lg border-2 border-white/20 backdrop-blur-sm" 
              onClick={() => router.push(`/courses/${courseId}/learn/${slugify(lessons[0]?.title || '')}`)}
            >
              Start Learning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Course */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">{course.name}</h1>
              <button
                onClick={isSaved ? handleUnsaveCourse : handleSaveCourse}
                disabled={savingCourse}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  savingCourse 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-secondary-100 hover:scale-110'
                }`}
                title={isSaved ? "Remove from saved" : "Save course"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill={isSaved ? "currentColor" : "none"}
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5" 
                  stroke="currentColor" 
                  className={`w-8 h-8 ${isSaved ? 'text-primary-600' : 'text-secondary-600'}`}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" 
                  />
                </svg>
              </button>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
              {course.description}
            </p>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-tertiary mb-6 flex items-center gap-2 border-b pb-2">
                Course Content
                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full ml-auto">
                  {lessons.length} lessons
                </span>
              </h2>
              
              <div className="space-y-3">
                {lessons.map((sub, index) => (
                  <div
                    key={sub.id}
                    className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        {index + 1}
                      </span>
                      <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-secondary transition-colors">
                        {sub.title}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        router.push(`/courses/${courseId}/learn/${slugify(sub.title)}`);
                      }}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-sm"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* About this course */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 sticky top-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">About this course</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <img className="w-6 h-6" src="/time.png" alt="" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">4-5 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <img className="w-6 h-6" src="/lessons.png" alt="" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{lessons.length} lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <img className="w-6 h-6" src="/practices.png" alt="" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Practice</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">1 Project</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
