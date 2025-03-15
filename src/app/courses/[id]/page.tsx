import { notFound } from "next/navigation";
import Image from "next/image";
import { onlineCourses } from "@/app/lib/online-course";
import Layout from "@/components/Layout";

export default function CourseDetail({ params }: { params: { id: string } }) {
    // ค้นหาคอร์สตาม `id`
    const course = onlineCourses.find((c) => c.id.toString() === params.id);

    // ถ้าไม่พบ course ให้แสดงหน้า 404
    if (!course) return notFound();

    return (
        <Layout>
            <div className="relative w-screen h-96">
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
            </div>
        </Layout>
    );
}
