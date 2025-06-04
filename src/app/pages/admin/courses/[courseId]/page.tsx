"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl: string
}

export default function AdminCourseLessons() {
  const { courseId } = useParams()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: "", content: "", videoUrl: "" })

  const fetchLessons = async () => {
    const res = await fetch(`/api/admin/courses/${courseId}/lessons`)
    const data = await res.json()
    setLessons(data)
  }

  useEffect(() => {
    fetchLessons()
  }, [courseId])

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/admin/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson)
    })
    setNewLesson({ title: "", content: "", videoUrl: "" })
    setIsDialogOpen(false)
    fetchLessons()
  }

  const handleDelete = async (lessonId: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบบทเรียนนี้?")) return
    await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" })
    fetchLessons()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lessons in Course</h1>

      <button onClick={() => setIsDialogOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        + เพิ่ม Lesson
      </button>

      {lessons.map(lesson => (
        <div key={lesson.id} className="border p-3 my-2">
          <h2 className="font-semibold">{lesson.title}</h2>
          <p>{lesson.content}</p>
          {lesson.videoUrl && <a href={lesson.videoUrl} className="text-blue-500" target="_blank">ดูวิดีโอ</a>}
          <div className="mt-2">
            <button onClick={() => handleDelete(lesson.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">เพิ่ม Lesson ใหม่</h2>
            <form onSubmit={handleAddLesson} className="space-y-2">
              <input type="text" placeholder="Title" value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} className="border p-1 w-full" />
              <input type="text" placeholder="Content" value={newLesson.content} onChange={e => setNewLesson({ ...newLesson, content: e.target.value })} className="border p-1 w-full" />
              <input type="text" placeholder="Video URL (optional)" value={newLesson.videoUrl} onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })} className="border p-1 w-full" />
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="bg-gray-300 px-3 py-1">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-3 py-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
