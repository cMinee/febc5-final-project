"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CreateCourseDialog from "@/components/CreateCourseDialog"
import Layout from "@/components/Layout"

interface Course {
  id: string
  name: string
  description: string
  price: number
  category: string
  img: string
}

export default function CoursesManagePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const router = useRouter()

  const fetchCourses = async () => {
    setIsLoading(true)
    const res = await fetch("/api/admin/courses")
    const data = await res.json()
    setCourses(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDelete = async (courseId: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบ course นี้?")) return
    await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" })
    fetchCourses()
  }

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Courses Manage</h1>

        <div className="mb-4 flex items-end justify-end mb-6">
          <button onClick={() => {setIsDialogOpen(true); setEditingCourse(null);}} className="bg-secondary text-primary px-4 py-2 rounded">
            + เพิ่มคอร์ส
          </button>
        </div>

        {isLoading ? ( <p>Loading...</p> ) : (
          <table className="table-auto w-full border-collapse shadow-md border border-gray-300 rounded-lg overflow-y-auto">
            <thead className="bg-fourth text-primary text-left">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 w-1/3">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-black">
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    <img src={course.img} alt={course.name} className="w-14 h-14 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => router.push(`/pages/admin/courses/${course.id}`)}>
                    {course.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 break-words line-clamp-3">
                    {course.description}
                  </td>
                  <td className="px-4 py-2">{course.price}</td>
                  <td className="px-4 py-2">{course.category}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                      onClick={() => {
                        setEditingCourse(course);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ✅ Add Dialog */}
        <CreateCourseDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={fetchCourses}
          course={editingCourse}
        />
      </div>
    </Layout>
  )
}
