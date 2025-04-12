"use client";

import { useParams, notFound } from "next/navigation";
import { courseDetails } from "@/app/lib/courses-detail";
import { onlineCourses } from "@/app/lib/online-course";

function deslugify(slug: string) {
  return slug.replace(/-/g, " ").toLowerCase();
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export default function LearnPage() {
  const { id, slug } = useParams();
  const courseId = Number(id);
  const slugTitle = deslugify(slug as string);

  const course = courseDetails.find((c) => c.id === courseId);
  const mainCourse = onlineCourses.find((c) => c.id === courseId);

  if (!course || !mainCourse) return notFound();

  const current = course.subSections.find(
    (s) => s.title.toLowerCase() === slugTitle
  );
  const currentIndex = course.subSections.findIndex(
    (s) => s.title.toLowerCase() === slugTitle
  );

  if (!current) return notFound();

  const next = course.subSections[currentIndex + 1];

  async function handleComplete() {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // mock user ID
          courseId: courseId,
          subSectionId: current.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to save progress");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex min-h-screen text-white">
      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-2">{current.title}</h1>
        <p className="mb-4 text-gray-300">{mainCourse.name}</p>

        <video
          controls
          className="w-full rounded-md"
          onEnded={handleComplete}
        >
          <source src={current.videoUrl} type="video/mp4" />
        </video>

        {next && next.unlocked && (
          <div className="mt-6">
            <button
              onClick={() =>
                (window.location.href = `/courses/${courseId}/learn/${slugify(next.title)}`)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              บทเรียนถัดไป: {next.title}
            </button>
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <div className="w-72 bg-gray-900 border-l border-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">บทเรียน</h2>
        <div className="space-y-2">
          {course.subSections.map((s) => (
            <div
              key={s.id}
              className={`p-3 rounded-md flex justify-between items-center 
                ${
                  s.unlocked
                    ? "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                    : "bg-gray-800 text-gray-400 cursor-not-allowed"
                }`}
              onClick={() => {
                if (s.unlocked) {
                  window.location.href = `/courses/${courseId}/learn/${slugify(s.title)}`;
                }
              }}
            >
              <span className="truncate text-sm">{s.title}</span>
              <span className="text-xs font-bold">
                {s.unlocked ? "เริ่ม" : "🔒"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
