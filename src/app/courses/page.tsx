import { db } from "../db";
import Layout from "@/components/Layout";
import CourseItemLists from "@/components/CourseItemLists";

export const dynamic = "force-dynamic";

export default async function AllCoursesPage() {
  const allCourses = await db.course.findMany();
  const savedCourses = await db.savedCourse.findMany();

  // Free Courses
  const freeCourses = allCourses.filter(c => {
    if (c.price === undefined) return false;
    return c.price === "free" || c.price === 0;
  });

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
        
        {/* Free Courses */}
        <div className="mb-12">
          <CourseItemLists 
            courses={freeCourses} 
            title="🎁 Free Courses" 
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
