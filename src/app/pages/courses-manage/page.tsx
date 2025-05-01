import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/DeleteDialog";

export default function CoursesManagePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses-manage")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courses Manage</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
            <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="border px-4 py-2">{course.img}</td>
                <td className="border px-4 py-2">{course.name}</td>
                <td className="border px-4 py-2">{course.description}</td>
                <td className="border px-4 py-2">{course.price}</td>
                <td className="border px-4 py-2">{course.category}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() =>
                      router.push(`/pages/courses-manage/${course.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn" onClick={()=>document.getElementById('my_modal_5').showModal()}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <DeleteDialog
        id="my_modal_5"
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete this Course"
        message="If you delete this course, you can't undo this action."
      />
    </div>
  );
}
