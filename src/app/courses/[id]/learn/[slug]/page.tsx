"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  courseId: string;
};

type Progress = {
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  const slugTitle = decodeURIComponent((params?.slug as string)?.toLowerCase().replace(/-/g, " "));

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Mock User ID (ในระบบจริงควรดึงจาก Session)
  const userId = "1";


  useEffect(() => {
    const fetchLesson = async () => {
      try {
        // 1. โหลด lessons ทั้งหมดในคอร์สนี้
        const resAll = await fetch(`/api/admin/courses/${courseId}/lessons`);
        const all = await resAll.json();
        setAllLessons(all);

        // 2. หา lesson ที่ตรงกับ slug
        const currentLesson = all.find(
          (l: Lesson) => slugify(l.title) === slugify(slugTitle)
        );

        if (!currentLesson) throw new Error("Lesson not found");

        // 3. โหลดข้อมูลละเอียดของ lesson
        const resDetail = await fetch(`/api/admin/courses/${courseId}/lessons/${currentLesson.id}`);
        const data = await resDetail.json();

        setLesson(data);

        // 4. โหลดข้อมูลความคืบหน้า
        const resProgress = await fetch(`/api/progress?userId=${userId}`);
        const progressData: Progress[] = await resProgress.json();
        const completedIds = progressData.filter(p => p.completed).map(p => p.lessonId);
        setCompletedLessons(completedIds);

      } catch (err) {
        console.error("❌ Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchLesson();
  }, [courseId, slugTitle]);

  // คำนวณ Progress Percentage
  const progressPercentage = allLessons.length > 0 
    ? Math.round((completedLessons.length / allLessons.length) * 100) 
    : 0;

  // ฟังก์ชันบันทึก Progress และไปบทเรียนถัดไป
  const handleCompleteAndNext = async (nextLesson: Lesson | null) => {
    if (!lesson) return;

    // 1. บันทึก Progress ลง DB
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lessonId: lesson.id,
          completed: true
        })
      });

      // 2. อัปเดต State ทันทีเพื่อให้ UI เปลี่ยน
      if (!completedLessons.includes(lesson.id)) {
        setCompletedLessons([...completedLessons, lesson.id]);
      }

      // 3. ไปหน้าถัดไป
      if (nextLesson) {
        router.push(`/courses/${courseId}/learn/${slugify(nextLesson.title)}`);
      }
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  };

  // prev next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lesson?.id);
  const next = currentIndex !== -1 ? allLessons[currentIndex + 1] : null;
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  if (loading) return <p>Loading...</p>;
  if (!lesson) return notFound();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push(`/courses/${courseId}`)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-600 dark:text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{lesson.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
            {/* Video and Navigation Column - Takes 2 columns on large screens */}
            <div className="lg:col-span-2"> 
              <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video mb-6">
                {lesson.videoUrl.includes("youtube.com") ? ( 
                  <iframe 
                    className="w-full h-full" 
                    src={lesson.videoUrl} 
                    title={lesson.title} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  /> 
                ) : ( 
                  <video controls className="w-full h-full" key={lesson.videoUrl}> 
                    <source src={lesson.videoUrl} type="video/mp4" /> 
                    Your browser does not support the video tag.
                  </video> 
                )} 
              </div>

              {lesson.content && ( 
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Lesson Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed"> 
                  {lesson.content} 
                  </p>
                </div>
              )} 

              {/* prev next button */} 
              <div className="flex justify-between items-center"> 
                <button 
                  disabled={!prev}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    prev 
                      ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 border border-gray-200 dark:border-gray-700 shadow-sm' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => prev && router.push(`/courses/${courseId}/learn/${slugify(prev.title)}`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  Previous
                </button> 

                {next ? ( 
                  <button 
                    className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 shadow-md transition-all hover:shadow-lg" 
                    onClick={() => handleCompleteAndNext(next)}
                  >
                    Next Lesson
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button> 
                ) : (
                  <button 
                    className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 shadow-md" 
                    onClick={() => handleCompleteAndNext(null)}
                  >
                    Finish Course
                  </button> 
                )}
              </div>
              
              {/* Comment Section (Simplified UI) */}
              <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Discussion</h3>

                <textarea
                  placeholder="Any idea or if you have any question?"
                  className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900 dark:text-white"
                  rows={4}
                />

                <div className="flex items-end text-end justify-end">
                  <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors mt-4 font-medium"
                  > Post
                  </button>
                </div>
                
              </div>
            </div> 
            
            {/* Lessons Sidebar - Takes 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Course Progress</h2>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300">Lessons</h3>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {allLessons.map((l: Lesson, index) => {
                    const isCurrentLesson = l.id === lesson?.id;
                    const isCompleted = completedLessons.includes(l.id);
                    
                    return (
                      <button
                        key={l.id}
                        onClick={() => router.push(`/courses/${courseId}/learn/${slugify(l.title)}`)}
                        className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 border ${
                          isCurrentLesson
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 shadow-sm' 
                            : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                            : isCurrentLesson 
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className={`text-sm font-medium truncate ${isCurrentLesson ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          {l.title}
                        </span>
                        {l.duration && (
                          <span className="ml-auto text-xs text-gray-400">{l.duration}m</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </Layout>
  );
}
