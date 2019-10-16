import {describe, it, beforeEach, before} from 'mocha';
import {expect} from 'chai';
import app from '../../app';
import request from 'supertest';
import {
	createUser, 
	tearDownData,
	sendPostRequest,
	validateInvalidRequestResponse
} from './test-util';
import {
	findStudentWithEmailAddress
} from '../../utils/domain-utils';
import model from '../../models';

const {Student} = model;
const suspendStudentApiUrl = '/api/suspend';

describe('Suspend student',  ()=> {

	before(()=>model.sequelize.sync({alter: true}));
	beforeEach( ()=>tearDownData());

	it('GIVEN a non suspended student WHEN /api/suspend is invoked THEN student is suspended.', done => {

		//GIVEN
		const student = createUser('s1', 'sl1', 's1@xyz.com');

		const givenTheStudents = async ()=>{
			await Student.create(student);
		};

		const suspendStudentRequest = {'student': 's1@xyz.com'};

		givenTheStudents().then(()=> {

			//WHEN
			request(app).post(suspendStudentApiUrl)
				.set('Accept', 'application/json')
				.send(suspendStudentRequest)

				//THEN
				.expect(204)
				// eslint-disable-next-line no-unused-vars
				.end((err, res)=> {
					if (err) return done(err);
					findStudentWithEmailAddress('s1@xyz.com')
						.then( students => {
							expect(students[0].suspend).to.be.equal(true);
							done();
						});
				});
		});
	});

	it('GIVEN student already suspended WHEN /api/suspend is invoked THEN 422 status code is returned.', done => {
			
		//GIVEN
		const student = createUser('s1', 'sl1', 's1@xyz.com');
		const givenTheStudents = async ()=>{
			await Student.create({...student, suspend: true});
		};
		const suspendStudentRequest = {'student': 's1@xyz.com'};
		
		givenTheStudents().then( ()=>{
			//WHEN
			const response = sendPostRequest(suspendStudentApiUrl, app, suspendStudentRequest);

			//THEN
			validateInvalidRequestResponse(response, done);
		});
	});

	it('GIVEN invalid student email WHEN /api/suspend is invoked THEN 422 status code is returned.', done => {
		//GIVEN
		const suspendStudentRequest = {'student': 'delete from student;'};

		//WHEN
		const response = sendPostRequest(suspendStudentApiUrl, app, suspendStudentRequest);

		//THEN
		validateInvalidRequestResponse(response, done);
	});
});