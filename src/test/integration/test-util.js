import model from '../../models';
import BlueBird from 'bluebird';
import request from 'supertest';
import {expect} from 'chai';

const {Student, Teacher} = model;
const {TeacherStudent} = model.sequelize.models;

export const tearDownData = () => BlueBird.all([
	Student.destroy({ truncate: true }),
	Teacher.destroy({ truncate: true }),
	TeacherStudent.destroy({ truncate: true })
]);

export const createUser = (firstName, lastName, email) => ({
	'firstName':firstName,
	'lastName':lastName,
	'email':email
});

export const sendPostRequest = (url, app, registerStudentRequest) =>{
	//WHEN
	return request(app).post(url)
		.set('Accept', 'application/json')
		.send(registerStudentRequest);
};

export const validateInvalidRequestResponse = (response, done) => {
	response
		.expect(422)
		.end((err, res)=>{
			if (err) return done(err);
			expect(res.body.message).to.not.be.null;
			done();
		});
};