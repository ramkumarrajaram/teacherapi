import express from 'express';
import {isEmpty} from 'lodash';
import {isNotValidEmail, addStatusAndMessageToResponse} from '../utils';
import {findStudentWithEmailAddress} from './domain-utils';

var suspendStudent = express.Router();

suspendStudent.post('/', (req, res) => {
	const studentEmail = req.body.student;
    
	if(isNotValidRequest(studentEmail, res)){
		return;
	}

	findStudentWithEmailAddress(studentEmail)
		.then(students => {
			if (students.length==1) {
				const student = students[0];
				if(student.suspend){
					addStatusAndMessageToResponse(res, 422, `Student ${studentEmail} already marked suspend.`);
				}else{
					student
						.update({suspend: true})
						.then(() => res.status(204).end());
				}
			} else {
				addStatusAndMessageToResponse(res, 422, `Student with email address : ${studentEmail} does'not exist.`);
			}
		});
});

const isNotValidRequest = (studentEmail, res)=>{

	if(isEmpty(studentEmail)){
		addStatusAndMessageToResponse(res, 422, 'student email address cannot be empty');
		return true;
	}

	if(isNotValidEmail(studentEmail)){
		addStatusAndMessageToResponse(res, 422, `student email address ${studentEmail} is not valid`);
		return true;
	}
};

export default suspendStudent;