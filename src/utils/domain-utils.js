import model from '../models';

const {Student, Teacher} = model;
const {TeacherStudent} = model.sequelize.models;

export const findTeacherWithEmail = (teacherEmail) => Teacher.findOne({
	where: {
		email: teacherEmail
	}
});

export const findStudentWithEmailAndTeacherId = (studentsEmailAddresses, teacherId)=> Student.findAll({
	include: [{
		model: Teacher
	}],
	where: {
		email: studentsEmailAddresses,
		'$TeacherId$': teacherId
	}
});

export const findNonSuspendedStudentWithTeachersEmail = (teacherEmail) => 

	Student.findAll({
		attributes: ['email'],
		include: [{
			model: Teacher
		}],
		where: {
			suspend: false,
			'$Teachers.email$': teacherEmail
		}
	});

export const findStudentWithEmailAddress = (email) => Student.findAll({
	where: { email: email }
});

export const findNonSuspendedStudentWithEmailAddress = (email) => Student.findAll({
	where: { suspend: false, email: email }
});

export const registerStudentWithTeacher = (students, teacherId) => {
	const teacherStudentArray = students.map(student =>
		({
			TeacherId: teacherId,
			StudentId: student.id
		})
	);
	TeacherStudent.bulkCreate(teacherStudentArray);
};

export const aggregateStudentEmailWithProvidedTeachersEmail = (teacherEmailList)=>
	Student
		.count({
			group: [ 'Student.email' ],
			having: model.sequelize.literal(`count(*) = ${teacherEmailList.length}`),
			include: [
				{
					model: Teacher
				}
			],
			where: { '$Teachers.email$': teacherEmailList }
		});