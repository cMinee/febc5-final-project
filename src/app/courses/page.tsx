import { db } from "../db";
import Layout from "@/components/Layout";
import CourseItemLists from "@/components/CourseItemLists";

export const dynamic = "force-dynamic";

export default async function AllCoursesPage() {
  const allCourses = await db.course.findMany();
  const savedCourses = await db.savedCourse.findMany();

  // New Courses (last 1 month)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const newCourses = allCourses.filter(c => {
    if (!c.createdAt) return false;
    return new Date(c.createdAt) > oneMonthAgo;
  }).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

  // Popular Courses
  const popularityMap = new Map<string, number>();
  savedCourses.forEach(sc => {
    popularityMap.set(sc.courseId, (popularityMap.get(sc.courseId) || 0) + 1);
  });

  const popularCourses = [...allCourses].sort((a, b) => {
    const popA = popularityMap.get(a.id) || 0;
    const popB = popularityMap.get(b.id) || 0;
    return popB - popA;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Courses</h1>
        
        {/* New Courses */}
        <div className="mb-12">
          <CourseItemLists 
            courses={newCourses} 
            title="✨ New Courses" 
            hideSearch={true} 
            limit={4} 
            disableSorting={true}
          />
        </div>

        {/* Popular Courses */}
        <div className="mb-12">
          <CourseItemLists 
             courses={popularCourses.slice(0, 8)} 
             title="🔥 Popular Courses" 
             hideSearch={true} 
             limit={4} 
             disableSorting={true}
          />
        </div>

        {/* All Courses (Searchable) */}
        <div id="all-courses">
           <CourseItemLists 
             courses={allCourses} 
             title="📚 All Courses" 
           />
        </div>
      </div>
    </Layout>
  );
}
