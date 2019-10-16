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
	findTeacherWithEmail, 
	findStudentWithEmailAndTeacherId, 
	registerStudentWithTeacher, 
	findStudentWithEmailAddress
} from '../../utils/domain-utils';
import model from '../../models';

const {Student, Teacher} = model;
const registerStudentApiUrl ='/api/register';

describe('Register a student with teacher',  ()=> {

	before(()=>model.sequelize.sync({alter: true}));
	beforeEach( ()=>tearDownData());

	it('GIVEN teacher and students WHEN /api/register is invoked THEN students are registered with teacher.', done => {

		//GIVEN
		const student1 = createUser('s1', 'sl1', 's1@xyz.com');
		const student2 = createUser('s2', 'sl2', 's2@xyz.com');
		const teacher1 = createUser('t1', 'tl1', 't1@xyz.com');

		const givenTheStudentsAndTeacher = async ()=>{
			await Student.create(student1);
			await Student.create(student2);
			await Teacher.create(teacher1);
		};

		const registerStudentRequest = {
			'teacher': 't1@xyz.com',
			'students':
			[
				's1@xyz.com',
				's2@xyz.com'
			]
		};

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).post(registerStudentApiUrl)
				.set('Accept', 'application/json')
				.send(registerStudentRequest)

				//THEN
				.expect(204)
				// eslint-disable-next-line no-unused-vars
				.end((err, res)=> {
					if (err) return done(err);
					findTeacherWithEmail('t1@xyz.com')
						.then( teacher => {
							const expectedRegisteredStudentEmails = [student1.email, student2.email];
							findStudentWithEmailAndTeacherId([student1.email, student2.email], teacher.id)
								.then(students=>{
									expect(students.length).to.equal(2);
									const actualRegisteredStudentEmails = students.filter(s=>expectedRegisteredStudentEmails.includes(s.email));
									expect(actualRegisteredStudentEmails.length).to.equal(2);
									done();
								});
						});
				});
		});
	});

	it('GIVEN students are already registered with teacher WHEN /api/register is invoked THEN 422 status code is returned.', done => {

		//GIVEN
		const student1 = createUser('s1', 'sl1', 's1@xyz.com');
		const student2 = createUser('s2', 'sl2', 's2@xyz.com');
		const teacher1 = createUser('t1', 'tl1', 't1@xyz.com');

		const givenTheStudentsAndTeacher = async ()=>{
			await Student.create(student1);
			await Student.create(student2);
			await Teacher.create(teacher1);
			const students = await findStudentWithEmailAddress(student1.email)
				.then(students => students) ;
			await findTeacherWithEmail(teacher1.email)
				.then(teacher=> registerStudentWithTeacher(students, teacher.id));
		};

		const registerStudentRequest = {
			'teacher': 't1@xyz.com',
			'students':
			[
				's1@xyz.com',
				's2@xyz.com'
			]
		};

		//WHEN
		givenTheStudentsAndTeacher()
			.then(()=> {

				//WHEN
				const response = sendPostRequest(registerStudentApiUrl, app, registerStudentRequest);

				//THEN
				validateInvalidRequestResponse(response, done);
			});
	});

	it('GIVEN teacher email is missing WHEN /api/register is invoked THEN 422 status code is returned.', done => {
			
		//GIVEN
		const registerStudentRequest = {
			'students':
			[
				's1@xyz.com',
				's2@xyz.com'
			]
		};

		//WHEN
		const response = sendPostRequest(registerStudentApiUrl, app, registerStudentRequest);

		//THEN
		validateInvalidRequestResponse(response, done);
	});

	it('GIVEN students email list is missing WHEN /api/register is invoked THEN 422 status code is returned.', done => {
			
		//GIVEN
		const registerStudentRequest = {
			'teacher':'t1@xyz.com'
		};

		//WHEN
		const response = sendPostRequest(registerStudentApiUrl, app, registerStudentRequest);

		//THEN
		validateInvalidRequestResponse(response, done);
	});

	it('GIVEN teacher email is invalid WHEN /api/register is invoked THEN 422 status code is returned.', done => {
			
		//GIVEN
		const registerStudentRequest = {
			'teacher':'delete from teacher;'
		};

		//WHEN
		const response = sendPostRequest(registerStudentApiUrl, app, registerStudentRequest);

		//THEN
		validateInvalidRequestResponse(response, done);
	});

	it('GIVEN student email is invalid WHEN /api/register is invoked THEN 422 status code is returned.', done => {
			
		//GIVEN
		const registerStudentRequest = {
			'teacher':'t1@xyz.com',
			'students':
			[
				'delete from student;',
				's2@xyz.com'
			]
		};

		//WHEN
		const response = sendPostRequest(registerStudentApiUrl, app, registerStudentRequest);

		//THEN
		validateInvalidRequestResponse(response, done);
	});
});