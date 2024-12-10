const { Day, PrismaClient, UserSex } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.createMany({
    data: [
      { id: "admin1", username: "admin1" },
      { id: "admin2", username: "admin2" },
    ],
  });

  // GRADE
  const gradeData = Array.from({ length: 6 }, (_, i) => ({ level: i + 1 }));
  await prisma.grade.createMany({ data: gradeData });

  // CLASS
  const classData = Array.from({ length: 6 }, (_, i) => ({
    name: `${i + 1}A`,
    gradeId: i + 1,
    capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
  }));
  await prisma.class.createMany({ data: classData });

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];
  await prisma.subject.createMany({ data: subjectData });

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 30)
        ),
      },
    });
  }

  // LESSON
  const lessonData = Array.from({ length: 30 }, (_, i) => ({
    name: `Lesson${i + 1}`,
    day: Day[
      Object.keys(Day)[Math.floor(Math.random() * Object.keys(Day).length)]
    ],
    startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
    subjectId: (i % 10) + 1,
    classId: (i % 6) + 1,
    teacherId: `teacher${(i % 15) + 1}`,
  }));
  await prisma.lesson.createMany({ data: lessonData });

  // PARENT
  const parentData = Array.from({ length: 25 }, (_, i) => ({
    id: `parentId${i + 1}`,
    username: `parentId${i + 1}`,
    name: `PName ${i + 1}`,
    surname: `PSurname ${i + 1}`,
    email: `parent${i + 1}@example.com`,
    phone: `123-456-789${i + 1}`,
    address: `Address${i + 1}`,
  }));
  await prisma.parent.createMany({ data: parentData });

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: `SName${i}`,
        surname: `SSurname${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 10)
        ),
      },
    });
  }

  // EXAM
  const examData = Array.from({ length: 10 }, (_, i) => ({
    title: `Exam ${i + 1}`,
    startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
    lessonId: (i % 30) + 1,
  }));
  await prisma.exam.createMany({ data: examData });

  // ASSIGNMENT
  const assignmentData = Array.from({ length: 10 }, (_, i) => ({
    title: `Assignment ${i + 1}`,
    startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    lessonId: (i % 30) + 1,
  }));
  await prisma.assignment.createMany({ data: assignmentData });

  // RESULT
  const resultData = Array.from({ length: 10 }, (_, i) => ({
    score: 90,
    studentId: `student${i + 1}`,
    ...(i < 5 ? { examId: i + 1 } : { assignmentId: i - 4 }),
  }));
  await prisma.result.createMany({ data: resultData });

  // ATTENDANCE
  const attendanceData = Array.from({ length: 10 }, (_, i) => ({
    date: new Date(),
    present: true,
    studentId: `student${i + 1}`,
    lessonId: (i % 30) + 1,
  }));
  await prisma.attendance.createMany({ data: attendanceData });

  // EVENT
  const eventData = Array.from({ length: 5 }, (_, i) => ({
    title: `Event ${i + 1}`,
    description: `Description for Event ${i + 1}`,
    startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
    classId: (i % 5) + 1,
  }));
  await prisma.event.createMany({ data: eventData });

  // ANNOUNCEMENT
  const announcementData = Array.from({ length: 5 }, (_, i) => ({
    title: `Announcement ${i + 1}`,
    description: `Description for Announcement ${i + 1}`,
    date: new Date(),
    classId: (i % 5) + 1,
  }));
  await prisma.announcement.createMany({ data: announcementData });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
