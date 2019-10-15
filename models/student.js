'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    issuspended: {
      type: DataTypes.BOOLEAN
    }
  });
  Student.associate = (models) => {
    Student.belongsToMany(models.Teacher, {
      through: 'TeacherStudents',
      as: 'teacher',
      foreignKey: 'studentId'
    })
  };
  return Student;
};