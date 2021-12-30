var mongoose = require("mongoose");

module.exports = async (classList, { userId, classId }) => {
  const { adapter } = classList;
  userId = mongoose.Types.ObjectId(userId);
  classId = mongoose.Types.ObjectId(classId);
  const Model1 = adapter.parentAdapter._manyModels.Class_students_many;
  const Model2 = adapter.parentAdapter._manyModels.Class_teachers_many;

  // delete the link
  const res1 = await Model1.deleteOne({
    Class_left_id: classId,
    User_right_id: userId,
  });
  const res2 = await Model2.deleteOne({
    Class_left_id: classId,
    User_right_id: userId,
  });
  return {
    message: "success",
  };
};
