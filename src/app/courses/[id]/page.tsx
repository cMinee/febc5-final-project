
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { Course, Lesson, Progress } from "../../db";
import PurchaseModal from "@/components/PurchaseModal";

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-');
}

export default function CourseDetail() {
  const params = useParams(); // params might be undefined initially
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = typeof params?.id === 'string' ? params.id : '';

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if(!courseId) return;

    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Course Detail
        const resCourse = await fetch(`/api/admin/courses/${courseId}`);
        if (!resCourse.ok) throw new Error("Course not found");
        const courseData = await resCourse.json();
        setCourse(courseData);

        // 2. Fetch Lessons
        const resLessons = await fetch(`/api/admin/courses/${courseId}/lessons`);
        const lessonsData = await resLessons.json();
        setLessons(lessonsData);

        // 3. User specific data (if logged in)
        if (session?.user?.id) {
          // Check Saved
          const resSaved = await fetch(`/api/saved-courses?userId=${session.user.id}`);
          const savedCourses = await resSaved.json();
          setIsSaved(savedCourses.some((c: any) => c.id === courseId));

          // Check Progress
          const resProgress = await fetch(`/api/progress?userId=${session.user.id}`);
          const myProgress = await resProgress.json();
          setProgress(myProgress || []);

          // Check Purchase (New)
          // Free courses are automatically "purchased"
          const isFree = !courseData.price || courseData.price === 'free' || courseData.price === 0;
          if (isFree) {
            setIsPurchased(true);
          } else {
             const resPurchase = await fetch(`/api/purchases?userId=${session.user.id}&courseId=${courseId}`);
             if (resPurchase.ok) {
                 const purchaseData = await resPurchase.json();
                 setIsPurchased(!!purchaseData);
             } else {
                 setIsPurchased(false);
             }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, session]);

  const handleSaveToggle = async () => {
     if (!session?.user?.id) return router.push("/pages/login");
     // ... (keep existing logic)
     try {
        const method = isSaved ? "DELETE" : "POST";
        const url = isSaved 
            ? `/api/saved-courses?userId=${session.user.id}&courseId=${courseId}`
            : "/api/saved-courses";
        
        const body = isSaved ? undefined : JSON.stringify({ userId: session.user.id, courseId });

        const res = await fetch(url, {
            method,
            headers: isSaved ? undefined : { "Content-Type": "application/json" },
            body
        });

        if (res.ok) {
            setIsSaved(!isSaved);
        }
     } catch(e) { console.error(e) }
  };

  const handleStartLesson = (lessonId: string) => {
      if (!session) {
          router.push("/pages/login");
          return;
      }
      if (!isPurchased) {
          setShowPurchaseModal(true);
          return;
      }
      
      const lesson = lessons.find(l => l.id === lessonId);
      // Assuming lesson has a slug or we use ID
      // The current routing seems to use slug, but data has ID. Adjust if needed.
      // If lesson object doesn't have slug, we might need to use ID or mock slug.
      const slug = (lesson as any).slug || slugify(lesson?.title || ''); 
      router.push(`/courses/${courseId}/learn/${slug}`);
  };

  if (isLoading) return <Layout><div className="p-8 text-center">Loading...</div></Layout>;
  if (!course) return <Layout><div className="p-8 text-center">Course not found</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* courses image */}
        <div>
          <img src={course.img} alt={course.name} className="w-full h-96 object-cover rounded-t-2xl" />
        </div>
        {/* Purchase/Start Banner */}
        <div className="bg-white dark:bg-gray-900 rounded-b-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100 dark:border-gray-800">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{course.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
                <div className="mt-4 flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {course.category || "General"}
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(!course.price || course.price === 'free' || course.price === 0) ? 'Free' : `฿${course.price}`}
                    </span>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={handleSaveToggle}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition ${isSaved ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-400' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                    <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : 'none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {isSaved ? 'Saved' : 'Save'}
                </button>

                {isPurchased ? (
                     <button 
                        onClick={() => handleStartLesson(lessons[0]?.id || '')}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition"
                    >
                        Continue Learning
                     </button>
                ) : (
                    <button 
                        onClick={() => setShowPurchaseModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition transform"
                    >
                        Enroll Now for {(!course.price || course.price === 'free' || course.price === 0) ? 'Free' : `฿${course.price}`}
                    </button>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
             <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
               <h2 className="text-2xl font-bold text-tertiary mb-6 flex items-center gap-2 border-b pb-2">
                Course Content
                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full ml-auto">
                  {lessons.length} lessons
                </span>
               </h2>
              
               <div className="space-y-3">
                {lessons.map((sub, index) => {
                  const isCompleted = progress.find(p => p.lessonId === sub.id && p.completed);
                  return (
                  <div
                    key={sub.id}
                    className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        {isCompleted ? '✓' : index + 1}
                      </span>
                      <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-secondary transition-colors">
                        {sub.title}
                      </p>
                    </div>
                    
                    <button
                        onClick={() => handleStartLesson(sub.id)}
                        className={`w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2
                             ${isCompleted 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : isPurchased 
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed group-hover:bg-gray-300'
                             }`} 
                         disabled={!isPurchased && !isCompleted}
                    >
                        {isCompleted ? 'Completed' : (isPurchased ? 'Start' : 'Locked')}
                    </button>
                  </div>
                )})}
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
                    {/* Mock Icon */}
                    <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">4-5 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                     <div className="w-6 h-6 bg-green-200 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{lessons.length} lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                     <div className="w-6 h-6 bg-purple-200 rounded-full"></div>
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

        {/* Purchase Mock Modal */}
        {course && session?.user?.id && (
            <PurchaseModal 
                course={course}
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                onPurchaseComplete={() => setIsPurchased(true)}
                userId={session.user.id}
            />
        )}
      </div>
    </Layout>
  );
}
