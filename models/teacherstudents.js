'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherStudents = sequelize.define('TeacherStudents', {
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull : false,
      references : {
        model: 'Teacher',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull : false,
      references : {
        model: 'Student',
        key: 'id'
      }
    }
  });

  return TeacherStudents;
};