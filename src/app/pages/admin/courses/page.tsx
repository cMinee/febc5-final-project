"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CreateCourseDialog from "@/components/CreateCourseDialog"

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

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบ course นี้?")) return
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" })
    fetchCourses()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courses Manage</h1>

      <div className="mb-4">
        <button onClick={() => setIsDialogOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          + เพิ่มคอร์ส
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td><img src={course.img} alt={course.name} className="w-12 h-12 object-cover" /></td>
                <td>
                  <a href="courses/{course.id}" className="text-blue-500 none-underline">{course.name}</a>
                </td>
                <td>{course.description}</td>
                <td>{course.price}</td>
                <td>{course.category}</td>
                <td>
                  <button className="text-blue-500" onClick={() => router.push(`/admin/courses/${course.id}`)}>Edit</button>{" "}
                  <button className="text-red-500" onClick={() => handleDelete(course.id)}>Delete</button>
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
      />
    </div>
  )
}
