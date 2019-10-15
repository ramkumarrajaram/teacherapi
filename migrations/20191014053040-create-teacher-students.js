'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TeacherStudents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Teacher",
          key: "id"
        }
      },
      studentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Student",
          key: "id"
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TeacherStudents');
  }
};