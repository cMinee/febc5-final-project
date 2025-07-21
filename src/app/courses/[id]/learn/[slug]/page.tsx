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
  const courseId = params?.id as string;
  const slugTitle = decodeURIComponent((params?.slug as string)?.toLowerCase().replace(/-/g, " "));

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // const [progress, setProgress] = useState<Progress | null>(null);

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
        // const resProgress = await fetch(`/api/progress`);
        // const progressData = await resProgress.json();
        // setProgress(progressData);

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
      <div className="p-8 text-fourth">
        <div className="flex align-center mb-4">
          <a href={`/courses/${courseId}`} className="text-fourth hover:underline mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
        </div>

        {/* row and 2 column */}
        <div> 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
            {/* Video and Navigation Column - Takes 2 columns on large screens */}
            <div className="lg:col-span-2"> 
              {lesson.videoUrl.includes("youtube.com") ? ( 
                <iframe 
                  className="w-full aspect-video rounded-lg" 
                  src={lesson.videoUrl} 
                  title={lesson.title} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                /> 
              ) : ( 
                <video controls className="w-full rounded-lg"> 
                  <source src={lesson.videoUrl} type="video/mp4" /> 
                </video> 
              )} 

              {lesson.content && ( 
                <div className="mt-4 text-primary whitespace-pre-wrap"> 
                  {lesson.content} 
                </div> 
              )} 

              {/* prev next button */} 
              <div className="flex justify-between mt-6"> 
                {currentIndex > 0 && ( 
                  <button 
                    className="flex items-center text-fourth font-semibold px-6 py-2 rounded-full" 
                    onClick={() => 
                      window.location.href = `/courses/${courseId}/learn/${slugify(allLessons[currentIndex - 1].title)}` 
                    } 
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4 text-fourth">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Prev 
                  </button> 
                )} 

                {next && ( 
                  <button 
                    className="flex items-center text-fourth font-semibold px-6 py-2 rounded-full" 
                    onClick={() => 
                      window.location.href = `/courses/${courseId}/learn/${slugify(next.title)}` 
                    } 
                  >
                    Next 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4 text-fourth">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button> 
                )} 
              </div>
              <div className="mt-6 bg-tertiary border-fourth border p-4 rounded-lg">
                <p className="text-2xl font-bold mb-4 text-fourth">Comment</p>

                <textarea
                  placeholder="Any idea or if you have any question?"
                  className="w-full md:text-xl h-40 p-4 rounded-lg border border-fourth focus:outline-none focus:ring-2 focus:ring-fourth resize-none text-fourth"
                />

                <div className="flex items-end text-end justify-end">
                  <button
                    className="md:text-xl bg-secondary text-primary px-6 py-2 rounded-lg hover:shadow-lg hover:border-fourth hover:border transition-colors mt-4"
                  > Post
                  </button>
                </div>
                
              </div>
            </div> 
            
            {/* Lessons Sidebar - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-primary border-fourth border p-4 rounded-lg top-4">
                <h2 className="text-xl font-bold mb-4 text-fourth">Progress</h2>
                <progress className="progress progress-warning w-full rounded-full bg-secondary" value={50} max="100"></progress>
              </div>
              <div className="bg-fourth p-4 rounded-lg top-4 mt-3 min-h-screen">
                <h2 className="text-xl font-bold mb-8 text-primary">Lessons</h2>
                <ul className="space-y-6">
                  {allLessons.map((l: Lesson) => {
                    // เช็คว่าเป็นบทเรียนปัจจุบันหรือไม่
                    const isCurrentLesson = l.id === lesson?.id;
                    
                    return (
                      <li key={l.id}>
                        <a
                          href={`/courses/${courseId}/learn/${slugify(l.title)}`}
                          className={`block py-2 px-3 rounded transition-all duration-200 ${
                            isCurrentLesson
                              ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold shadow-lg border-l-4 border-primary' // สีเด่นพร้อม gradient และ border
                              : 'text-primary hover:bg-gray-700 hover:pl-4' // สีปกติพร้อม animation
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
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
