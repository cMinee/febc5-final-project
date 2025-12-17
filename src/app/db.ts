import fs from 'fs/promises';
import path from 'path';

// กำหนด path ของไฟล์ JSON
const DB_PATH = path.join(process.cwd(), 'src', 'app', 'db.json');

// Interface สำหรับข้อมูล (ปรับแก้ตาม Schema จริงของคุณได้)
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  img?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  courseId: string;
  [key: string]: any;
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  [key: string]: any;
}

export interface SavedCourse {
  id: string;
  userId: string;
  courseId: string;
  savedAt: string;
  [key: string]: any;
}

interface DbSchema {
  users: User[];
  courses: Course[];
  lessons: Lesson[];
  progress: Progress[];
  savedCourses: SavedCourse[];
}

// ฟังก์ชันอ่านข้อมูล
async function readDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ถ้ายังไม่มีไฟล์ ให้คืนค่าว่าง
    return { users: [], courses: [], lessons: [], progress: [], savedCourses: [] };
  }
}

// ฟังก์ชันบันทึกข้อมูล
async function writeDb(data: DbSchema) {
  // ตรวจสอบว่ามีโฟลเดอร์หรือไม่ ถ้าไม่มีให้สร้าง
  const dir = path.dirname(DB_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper function สำหรับ filter ข้อมูล
const filterData = (items: any[], where?: any) => {
  if (!where) return items;
  return items.filter(item => {
    return Object.keys(where).every(key => {
      if (where[key] === undefined) return true;
      return item[key] === where[key];
    });
  });
};

// Generic CRUD handler
const createModelHandler = (collectionName: keyof DbSchema) => ({
  findMany: async ({ where }: { where?: any } = {}) => {
    const data = await readDb();
    const items = data[collectionName];
    return filterData(items, where);
  },
  findUnique: async ({ where }: { where: { id: string } }) => {
    const data = await readDb();
    // @ts-ignore
    return data[collectionName].find((item) => item.id === where.id) || null;
  },
  findFirst: async ({ where }: { where?: any }) => {
    const data = await readDb();
    const items = data[collectionName];
    const filtered = filterData(items, where);
    return filtered.length > 0 ? filtered[0] : null;
  },
  create: async ({ data }: { data: any }) => {
    const dbData = await readDb();
    const newItem = {
      id: Date.now().toString(),
      ...data,
      // เพิ่ม createdAt สำหรับ course
      ...(collectionName === 'courses' ? { createdAt: new Date().toISOString() } : {}),
    };
    // @ts-ignore
    dbData[collectionName].push(newItem);
    await writeDb(dbData);
    return newItem;
  },
  update: async ({ where, data }: { where: { id: string }; data: any }) => {
    const dbData = await readDb();
    // @ts-ignore
    const index = dbData[collectionName].findIndex((item) => item.id === where.id);
    if (index === -1) throw new Error(`${String(collectionName)} not found`);
    
    // @ts-ignore
    dbData[collectionName][index] = { ...dbData[collectionName][index], ...data };
    await writeDb(dbData);
    // @ts-ignore
    return dbData[collectionName][index];
  },
  delete: async ({ where }: { where: { id: string } }) => {
    const dbData = await readDb();
    // @ts-ignore
    const index = dbData[collectionName].findIndex((item) => item.id === where.id);
    if (index !== -1) {
      // @ts-ignore
      dbData[collectionName].splice(index, 1);
      await writeDb(dbData);
    }
    return { id: where.id };
  },
  count: async ({ where }: { where?: any } = {}) => {
    const data = await readDb();
    const items = data[collectionName];
    return filterData(items, where).length;
  }
});

// Mock Prisma Client
export const db = {
  user: createModelHandler('users'),
  course: createModelHandler('courses'),
  lesson: createModelHandler('lessons'),
  progress: createModelHandler('progress'),
  savedCourse: createModelHandler('savedCourses'),
};