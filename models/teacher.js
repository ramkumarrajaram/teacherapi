'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    email: DataTypes.STRING,
    unique: true,
    allowNull: false
  });
  Teacher.associate = (models) => {
    Teacher.belongsToMany(models.Student, {
      through: 'TeacherStudents',
      as: 'students',
      foreignKey: 'teacherId'
    })
  };
  return Teacher;
};