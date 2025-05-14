"use client"

import { useState } from "react"

export default function CreateCourseDialog({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    img: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price)
      }),
    })
    onSuccess()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">เพิ่มคอร์สใหม่</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-1 w-full" />
          <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-1 w-full" />
          <input type="text" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-1 w-full" />
          <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border p-1 w-full" />
          <input type="text" name="img" placeholder="Image URL" value={form.img} onChange={handleChange} className="border p-1 w-full" />
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-3 py-1">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
