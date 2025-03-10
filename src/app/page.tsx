// import Image from "next/image";
import Layout from "./components/Layout";
import BlogCarousel from "./components/BlogCarousel";

export default function Home() {
  return (
    <Layout>
      <h1>Hello World</h1>
      <BlogCarousel />
    </Layout>
  )
}
