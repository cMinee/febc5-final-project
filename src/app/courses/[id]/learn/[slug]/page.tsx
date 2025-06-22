"use client";

import { useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  courseId: string;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export default function LearnPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const slugTitle = decodeURIComponent((params?.slug as string)?.toLowerCase().replace(/-/g, " "));

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("❌ Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchLesson();
  }, [courseId, slugTitle]);

  // prev next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lesson?.id);
  const next = currentIndex !== -1 ? allLessons[currentIndex + 1] : null;

  if (loading) return <p>Loading...</p>;
  if (!lesson) return notFound();

  return (
    <Layout>
      <div className="p-8 text-white">
        <div className="flex align-center mb-4">
          <a href={`/courses/${courseId}`} className="text-blue-500 hover:underline mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </a>
          <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
        </div>

        {/* row and 2 column */}
        <div> 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
            {/* Video and Navigation Column - Takes 2 columns on large screens */}
            <div className="lg:col-span-2"> 
              {lesson.videoUrl.includes("youtube.com") ? ( 
                <iframe 
                  className="w-full aspect-video rounded-md" 
                  src={lesson.videoUrl} 
                  title={lesson.title} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                /> 
              ) : ( 
                <video controls className="w-full rounded-md"> 
                  <source src={lesson.videoUrl} type="video/mp4" /> 
                </video> 
              )} 

              {lesson.content && ( 
                <div className="mt-4 text-gray-300 whitespace-pre-wrap"> 
                  {lesson.content} 
                </div> 
              )} 

              {/* prev next button */} 
              <div className="flex justify-between mt-6"> 
                {currentIndex > 0 && ( 
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" 
                    onClick={() => 
                      window.location.href = `/courses/${courseId}/learn/${slugify(allLessons[currentIndex - 1].title)}` 
                    } 
                  > 
                    Prev 
                  </button> 
                )} 

                {next && ( 
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ml-auto" 
                    onClick={() => 
                      window.location.href = `/courses/${courseId}/learn/${slugify(next.title)}` 
                    } 
                  > 
                    Next 
                  </button> 
                )} 
              </div> 
            </div> 
            
            {/* Lessons Sidebar - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-4 rounded-md sticky top-4">
                <h2 className="text-3xl font-bold mb-4 text-white">Progress</h2>
                <progress className="progress progress-primary w-full" value={0} max="100"></progress>
              </div>
              <div className="bg-gray-800 p-4 rounded-md sticky top-4 mt-3">
                <h2 className="text-3xl font-bold mb-4 text-white">Lessons</h2>
                <ul className="space-y-2">
                  {allLessons.map((l: Lesson) => {
                    // เช็คว่าเป็นบทเรียนปัจจุบันหรือไม่
                    const isCurrentLesson = l.id === lesson?.id;
                    
                    return (
                      <li key={l.id}>
                        <a
                          href={`/courses/${courseId}/learn/${slugify(l.title)}`}
                          className={`block py-2 px-3 rounded transition-all duration-200 ${
                            isCurrentLesson
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-2xl shadow-lg border-l-4 border-blue-300' // สีเด่นพร้อม gradient และ border
                              : 'text-blue-400 hover:text-blue-300 text-2xl  hover:underline hover:bg-gray-700 hover:pl-4' // สีปกติพร้อม animation
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" className="text-white"/>
                            </svg>
                            {l.title}
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </Layout>
  );
}
