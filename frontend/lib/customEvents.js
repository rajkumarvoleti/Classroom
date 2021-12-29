export const refetchStudentData = new Event("refetchClassData", {
  detail: {
    type: "student",
  },
});

export const refetchTeacherData = new Event("refetchClassData", {
  detail: {
    type: "teacher",
  },
});
