import express from 'express';
import { isEmpty, isArray } from 'lodash';
import {
	isNotValidEmail, 
	addStatusAndMessageToResponse,
	findDuplicateValueInArray
} from '../utils';
import {
	findTeacherWithEmail,
	findStudentWithEmailAndTeacherId, 
	findStudentWithEmailAddress, 
	registerStudentWithTeacher
} from './domain-utils';

const registerStudentRoutes = express.Router();

registerStudentRoutes.post('/', function (req, res) {

	if(isNotValidRequest(req, res)){
		return;
	}

	const teacherEmail = req.body.teacher;
	findTeacherWithEmail(teacherEmail)
		.then((teacher) => {
			if (isEmpty(teacher)) {
				addStatusAndMessageToResponse(res, 422, `Teacher with email-id ${teacherEmail} doesn't exist`);
				return;
			}
			const studentEmailList = req.body.students;
			findStudentWithEmailAndTeacherId(studentEmailList, teacher.id)
				.then((students) => {
					if(areStudentsNotAlreadyAssociated(students, res)){
						findStudentWithEmailAddress(studentEmailList)
							.then( students => {
								if(doAllStudentExists(students, studentEmailList, res)){
									registerStudentWithTeacher(students, teacher.id);
									res.status(204);
									res.end();
								}
							});
					}
				});
		});
});

const isNotValidRequest = (req, res) => {
	const teacherEmail = req.body.teacher;
      
	if(isEmpty(teacherEmail)){
		addStatusAndMessageToResponse(res, 422, 'teacher email address cannot be empty');
		return true;
	}

	if(isNotValidEmail(teacherEmail)){
		addStatusAndMessageToResponse(res, 422, `teacher email address ${teacherEmail} is not valid`);
		return true;
	}

	let studentEmails = req.body.students;

	if(
		isEmpty(studentEmails) ||
            (isArray(studentEmails) && studentEmails === 0)
	){
		addStatusAndMessageToResponse(res, 422, 'students email list cannot be empty');
		return true;
	}
      
	studentEmails = isArray(studentEmails) ? studentEmails : [studentEmails];
	const invalidEmails = studentEmails.filter(isNotValidEmail);

	if(invalidEmails.length !==0){
		addStatusAndMessageToResponse(res, 422, `Invalid stundent's email addresses ${invalidEmails}`);
		return true;
	}

	const duplicateValues = findDuplicateValueInArray(req.body.students);
	if (duplicateValues.length > 0) {
		addStatusAndMessageToResponse(res, 422, `duplicate students email addresses in the students list : ${duplicateValues}`);
		return;
	}

	return false;
};

const areStudentsNotAlreadyAssociated = (students, res) =>{
	if (students.length > 0) {
		const arr = students.map(student => student.email);
		addStatusAndMessageToResponse(res, 422, `Student ${arr} already associated.`);
		return false;
	}
	return true;
};

const doAllStudentExists = (students, studentEmailList, res) =>{
	if(students.length !== studentEmailList.length){
		const existingStudents = students.map(student=> student.email);
		const notExistingStudents = studentEmailList.filter(email => !existingStudents.includes(email));
		addStatusAndMessageToResponse(res, 422, `Students ${notExistingStudents} don't exist`);
		return false;
	}
	return true;
};

export default registerStudentRoutes;