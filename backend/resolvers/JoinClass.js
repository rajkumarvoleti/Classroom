var mongoose = require("mongoose");

module.exports = async (classList, { code, userId: id, isTeacher }) => {
  const { adapter } = classList;
  const userId = mongoose.Types.ObjectId(id);
  let Model = adapter.parentAdapter._manyModels.Class_students_many;
  if (isTeacher) Model = adapter.parentAdapter._manyModels.Class_teachers_many;

  // find the classroom data
  const _class = isTeacher
    ? await adapter.find({
        teacherInviteCode: code,
      })
    : await adapter.find({
        studentInviteCode: code,
      });
  if (!_class[0]) return { message: "invalid code" };
  const classId = mongoose.Types.ObjectId(_class[0].id);

  // check if the user is already in the classroom
  const checkClass = await Model.find({
    Class_left_id: classId,
    User_right_id: userId,
  });
  if (checkClass[0]) return { message: "User already exsists in the class" };

  // create the link
  const updatedClass = await Model.create({
    Class_left_id: classId,
    User_right_id: userId,
  });
  return {
    message: "success",
  };
};
