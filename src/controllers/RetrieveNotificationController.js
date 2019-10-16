import express from 'express';
import { differenceWith, isEmpty } from 'lodash';
import {
	findTeacherWithEmail, 
	findNonSuspendedStudentWithTeachersEmail,
	findNonSuspendedStudentWithEmailAddress
} from '../utils/domain-utils';
import {addStatusAndMessageToResponse, isNotValidEmail} from '../utils';

const retrieveForNotificationsRoute = express.Router();

retrieveForNotificationsRoute.post('/', (req, res) => {
	const teacherEmail = req.body.teacher;

	if(isNotValidRequest(teacherEmail, res)){
		return;
	}

	findTeacherWithEmail(teacherEmail)
		.then(teacher => {
    
			if (!teacher) {
				addStatusAndMessageToResponse(res, 422, `Teacher with email ${teacherEmail} doesn't exist.`);
				return;
			}

			findNonSuspendedStudentWithTeachersEmail(teacherEmail)
				.then(students => {
					const registeredStudentEmails = students.map(student => student.email);
					const notRegisteredStudentsEmail = getNonRegisteredStudentsEmailFromNotification(req, registeredStudentEmails);
					if (notRegisteredStudentsEmail.length !== 0) {
						findNonSuspendedStudentWithEmailAddress(notRegisteredStudentsEmail)
							.then(notRegisteredStudents => {
								const emailList = notRegisteredStudents.map(student => student.email);
								res.status(200).send({recipients: [...registeredStudentEmails, ...emailList]});
							});
					} else {
						res.status(200).send({recipients: registeredStudentEmails});
					}
				});
		});
});

const getNonRegisteredStudentsEmailFromNotification = (req, registeredStudentEmails) =>{
	const notification = req.body.notification || '';
	const studentEmailInNotification = notification.split(' ').filter(word => word.startsWith('@')).map(email => email.substr(1));
	return differenceWith(studentEmailInNotification, registeredStudentEmails, (email1, email2) => email1.toLowerCase() === email2.toLowerCase());
};

const isNotValidRequest = (teacherEmail, res) => {
	if(isEmpty(teacherEmail)){
		addStatusAndMessageToResponse(res, 422, 'teacher email address cannot be empty');
		return true;
	}

	if(isNotValidEmail(teacherEmail)){
		addStatusAndMessageToResponse(res, 422, `teacher email address ${teacherEmail} is not valid`);
		return true;
	}
};

export default retrieveForNotificationsRoute;