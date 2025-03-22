import { notFound } from "next/navigation";
import Image from "next/image";
import { onlineCourses } from "@/app/lib/online-course";
import Layout from "@/components/Layout";

export default function CourseDetail({ params }: { params: { id: string } }) {
    // ค้นหาคอร์สตาม `id`
    const course = onlineCourses.find((c) => c.id.toString() === params.id);

    // ถ้าไม่พบ course ให้แสดงหน้า 404
    if (!course) return notFound();

    const exercises = [
        { id: 1, title: "Setting Up", unlocked: true, subSections: [
                { id: 1, title: "Setting Up", unlocked: true },
                { id: 2, title: "Hello World", unlocked: false },
                { id: 3, title: "Pattern", unlocked: false },
                { id: 4, title: "Initials", unlocked: false },
                { id: 5, title: "Snail Mail", unlocked: false },
                { id: 6, title: "Complete chapter to unlock", unlocked: false, bonus: true },
            ] 
        },
        { id: 2, title: "Hello World", unlocked: false },
        { id: 3, title: "Pattern", unlocked: false },
        { id: 4, title: "Initials", unlocked: false },
        { id: 5, title: "Snail Mail", unlocked: false },
        { id: 6, title: "Complete chapter to unlock", unlocked: false, bonus: true },
    ];

    return (
        <Layout>
            <div className="relative w-full h-96">
                <Image
                    src={course.img}
                    alt={course.name}
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 flex flex-col justify-center items-start px-12 bg-black bg-opacity-20 text-white">
                    <h2 className="text-6xl font-bold mb-2">{course.name}</h2>
                    <p className="text-lg max-w-2xl">{course.description}</p>
                    <button className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Start Learning</button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 border-2 border-solid border-white rounded-md">
                        <div className="mx-5 my-5">
                            <h4>{course.description}</h4>
                        </div>
                    </div>
                    <div className="border-2 border-solid border-white rounded-md">
                        <div className="mx-5 my-5">
                            <p className="text-2xl font-bold mb-4 my-5">About this course</p>
                            <p className="flex items-center gap-3 text-md mt-3">
                                <img className="w-8 h-8" src="/time.png" alt="" />
                                4-5 hours
                            </p>
                            <p className="flex items-center gap-3 text-md mt-3">
                                <img className="w-8 h-8" src="/lessons.png" alt="" />
                                45 lessons
                            </p>
                            <p className="flex items-center gap-3 text-md mt-3">
                                <img className="w-8 h-8" src="/practices.png" alt="" />
                                5 Practices
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 mt-8">
                    <div className="col-span-2 lg:grid-cols-2 border-2 border-solid border-white rounded-md">
                        <div className="mx-5 my-5">
                            <div className="grid gap-4">
                                {exercises.map((section, index) => (
                                    <div key={section.id} className="border-l-4 border-gray-600 pl-4">
                                    {/* Section Header */}
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-xl font-bold">
                                            {index + 1}
                                        </div>
                                        <h2 className="text-2xl font-bold">{section.title}</h2>
                                    </div>

                                    {/* Section Body */}
                                    {section.subSections && (
                                        <div className="bg-[#1e293b] p-6 rounded-md">
                                        <p className="mb-6 text-gray-300">
                                            Learn how to write your first line of Python by printing messages to the terminal.
                                        </p>

                                        <div className="grid gap-4">
                                            {section.subSections.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex justify-between items-center py-2 border-b border-gray-700"
                                            >
                                                <p className="w-1/3 text-gray-300">
                                                {sub.bonus ? "Bonus Article" : `Exercise ${sub.id}`}
                                                </p>
                                                <p className="w-1/2 font-semibold">{sub.title}</p>
                                                <button
                                                disabled={!sub.unlocked}
                                                className={`w-20 py-1 rounded border border-gray-400 text-center
                                                ${
                                                    sub.unlocked
                                                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                    : "bg-gray-700 text-gray-300 cursor-not-allowed"
                                                }`}
                                                >
                                                {sub.unlocked ? "Start" : "???"}
                                                </button>
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
