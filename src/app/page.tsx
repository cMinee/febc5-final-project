// import Image from "next/image";
import Layout from "./components/Layout";
import BlogCarousel from "./components/BlogCarousel";
import CourseItemLists from "./components/CourseItemLists";

export default function Home() {
  return (
    <Layout>
      <BlogCarousel />
      <div className="mt-8">
        <CourseItemLists />
      </div>
    </Layout>
  )
}
