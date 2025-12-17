// import Image from "next/image";
import Layout from "../components/Layout";
import BlogCarousel from "../components/BlogCarousel";
import CourseItemLists from "../components/CourseItemLists";
import { db } from "./db";

export default async function Home() {
  const courses = await db.course.findMany();

  return (
    <Layout>
      <BlogCarousel courses={courses} />
      <div className="mt-8">
        <CourseItemLists />
      </div>
    </Layout>
  )
}
