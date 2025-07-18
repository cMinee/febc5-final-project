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
      <div className="container mx-auto px-4 py-8">
        <div className="relative w-full h-96 mb-8">
          <img
            src={course.img}
            alt={course.name}
            className="object-cover w-full h-full rounded-xl"
            property="true"
          />

          <div className="absolute inset-0 flex flex-col justify-end items-start px-20 pb-10 text-white">
            <button className="lg:text-2xl font-semibold px-6 py-3 bg-secondary text-white rounded-full border-fourth border-4" onClick={() => window.location.href = `/courses/${courseId}/learn/${slugify(lessons[0]?.title || '')}`}>
              Start Learning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Description Course */}
          <div className="col-span-2 bg-fourth text-primary rounded-lg p-6">
            <p className="text-4xl font-semibold text-secondary">{course.name}</p>
            <p className="text-xl mt-4 mb-10">{course.description}</p>
            <div className="grid gap-4">
              <div className="text-2xl text-tertiary font-bold mb-2">Lessons</div>
              {lessons.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center py-2 border-b border-gray-700"
                >
                  <p className="w-1/2 font-semibold">{sub.title}</p>
                  <button
                    onClick={() => {
                      window.location.href = `/courses/${courseId}/learn/${slugify(sub.title)}`;
                    }}
                    className={"w-20 py-1 rounded border border-gray-400 text-center bg-blue-500 hover:bg-blue-600 text-fourth'"}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* About this course */}
          <div className="rounded-lg p-6 text-primary bg-fourth h-auto">
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
              1 Practices
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
