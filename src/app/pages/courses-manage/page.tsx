import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";

export default function CoursesManagePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
                    className="btn" onClick={()=>DeleteDialog.showModal()}
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
