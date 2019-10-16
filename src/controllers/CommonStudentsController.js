import express from 'express';
import {
	isNotValidEmail, 
	addStatusAndMessageToResponse, 
	convertToArrayIfNot
} from '../utils';
import {aggregateStudentEmailWithProvidedTeachersEmail} from '../utils/domain-utils';
import {isEmpty} from 'lodash';

const commonStudentsRoutes = express.Router();

commonStudentsRoutes.get('/', (req, res) => {
	let teacherList = req.query.teacher;
	if(isNotValidRequest(teacherList, res)){
		return;
	}
	teacherList = convertToArrayIfNot(teacherList);

	aggregateStudentEmailWithProvidedTeachersEmail(teacherList)
		.then(studentList => {
			const studentEmailList = studentList.map((student) => student.email);
			console.log(studentEmailList);
			res.status(200).send({students: studentEmailList});
		});
});

const isNotValidRequest = (teacherList, res) =>{
	if (isEmpty(teacherList)) {
		addStatusAndMessageToResponse(res, 422, 'Teachers list is empty.');
		return true;
	}
	teacherList = convertToArrayIfNot(teacherList);
	const invalidEmails = teacherList.filter(isNotValidEmail);
	if(invalidEmails.length !==0){
		addStatusAndMessageToResponse(res, 422, `Invalid emails ${invalidEmails}`);
		return true;
	}
	return false;
};

export default commonStudentsRoutes;
