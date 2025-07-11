"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import { CourseDetail, SubSection } from "@prisma/client";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id;
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetail[]>([]);
  const [lessons, setLessons] = useState<SubSection[]>([]);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch(() => setCourse([]))
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

  if (loading) return <p>Loading...</p>;

  function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  return (
    <Layout>
      <div className="relative w-full h-96">
        <img
          src={course.img}
          alt={course.name}
          className="object-cover w-full h-full"
          property="true"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-start px-12 bg-black bg-opacity-50 text-white">
          <h2 className="text-6xl font-bold mb-2">{course.name}</h2>
          <p className="text-lg max-w-2xl">{course.description}</p>
          <button className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => window.location.href = `/courses/${courseId}/learn/${slugify(lessons[0]?.title || '')}`}>
            Start Learning
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border-2 border-white rounded-md p-6 text-white">
            <p className="text-2xl font-bold mb-4">About this course</p>
            <p className="flex items-center gap-3 text-md mt-3">
              <img className="w-8 h-8" src="/time.png" alt="" />
              4-5 hours
            </p>
            {/* count lessons */}
            <p className="flex items-center gap-3 text-md mt-3">
              <img className="w-8 h-8" src="/lessons.png" alt="" />
              {lessons.length} lessons
            </p>
            <p className="flex items-center gap-3 text-md mt-3">
              <img className="w-8 h-8" src="/practices.png" alt="" />
              5 Practices
            </p>
          </div>
          <div className="col-span-2 border-2 border-white rounded-md p-6">
            <p className="text-xl mb-4 text-white">{course.description}</p>
            <div className="grid gap-4">
              <div className="text-2xl font-bold text-white mb-2">บทเรียน</div>
              {lessons.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center py-2 border-b border-gray-700"
                >
                  <p className="w-1/2 font-semibold text-white">{sub.title}</p>
                  <button
                    onClick={() => {
                      window.location.href = `/courses/${courseId}/learn/${slugify(sub.title)}`;
                    }}
                    className={"w-20 py-1 rounded border border-gray-400 text-center bg-blue-500 hover:bg-blue-600 text-white'"}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
