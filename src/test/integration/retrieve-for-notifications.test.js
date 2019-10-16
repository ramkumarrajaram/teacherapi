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
import {findDuplicateValueInArray} from '../../utils';
import {
	findTeacherWithEmail, 
	registerStudentWithTeacher, 
	findStudentWithEmailAddress
} from '../../routes/domain-utils';
import model from '../../models';

const {Student, Teacher} = model;
const retrieveForNotificationsApiUrl = '/api/retrievefornotifications';

describe('Retrieve the student list for notification.',  ()=> {

	before(()=>model.sequelize.sync({alter: true}));
	beforeEach( ()=>tearDownData());

	it('GIVEN students registered with teacher and non registered students in notification text WHEN /api/retrievefornotifications is invoked THEN registered and mentioned in notification students are returned.', done => {

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

		const retrieveForNotificationsRequest = {
			'teacher': 't1@xyz.com',
			'notification': 'Hi students! @s2@xyz.com @s2@xyz.com'
		};

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).post(retrieveForNotificationsApiUrl)
				.set('Accept', 'application/json')
				.send(retrieveForNotificationsRequest)

				//THEN
				.expect(200)
				.end((err, res)=> {
					if (err) return done(err);
					expect(res.body.recipients.length).to.be.equal(2);
					const expectedRecipientsArray = [student1.email, student2.email];
					const actualRecipientsArray = res.body.recipients.filter(email => expectedRecipientsArray.includes(email));
					expect(actualRecipientsArray.length).to.be.equal(expectedRecipientsArray.length);
					const duplicateEmails = findDuplicateValueInArray(actualRecipientsArray);
					expect(duplicateEmails.length).to.be.equal(0);
					done();
				});
		});
	});

	it('GIVEN students registered with teacher and registered students mentioned in notification text WHEN /api/retrievefornotifications is invoked THEN unique students email addresses are returned.', done => {

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

		const retrieveForNotificationsRequest = {
			'teacher': 't1@xyz.com',
			'notification': 'Hi students! @s1@xyz.com @s2@xyz.com'
		};

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).post(retrieveForNotificationsApiUrl)
				.set('Accept', 'application/json')
				.send(retrieveForNotificationsRequest)

				//THEN
				.expect(200)
				.end((err, res)=> {
					if (err) return done(err);
					expect(res.body.recipients.length).to.be.equal(2);
					const expectedRecipientsArray = [student1.email, student2.email];
					const actualRecipientsArray = res.body.recipients.filter(email => expectedRecipientsArray.includes(email));
					expect(actualRecipientsArray.length).to.be.equal(expectedRecipientsArray.length);
					const duplicateEmails = findDuplicateValueInArray(actualRecipientsArray);
					expect(duplicateEmails.length).to.be.equal(0);
					done();
				});
		});
	});

	it('GIVEN suspended students mentioned in notification and suspended registered with teacher WHEN /api/retrievefornotifications is invoked THEN only non suspended students are returned.', done => {

		//GIVEN
		const student1 = createUser('s1', 'sl1', 's1@xyz.com');
		const student2 = createUser('s2', 'sl2', 's2@xyz.com');
		const student3 = createUser('s3', 'sl3', 's3@xyz.com');
		const teacher1 = createUser('t1', 'tl1', 't1@xyz.com');

		const givenTheStudentsAndTeacher = async ()=>{
			await Student.create({...student1, suspend: true});
			await Student.create({...student2, suspend: true});
			await Student.create(student3);
			await Teacher.create(teacher1);
			const students = await findStudentWithEmailAddress(student1.email)
				.then(students => students) ;
			await findTeacherWithEmail(teacher1.email)
				.then(teacher=> registerStudentWithTeacher(students, teacher.id));
		};

		const retrieveForNotificationsRequest = {
			'teacher': 't1@xyz.com',
			'notification': 'Hi students! @s2@xyz.com @s3@xyz.com'
		};

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).post(retrieveForNotificationsApiUrl)
				.set('Accept', 'application/json')
				.send(retrieveForNotificationsRequest)

				//THEN
				.expect(200)
				.end((err, res)=> {
					if (err) return done(err);
					expect(res.body.recipients.length).to.be.equal(1);
					expect(res.body.recipients[0]).to.be.equal(student3.email);
					done();
				});
		});
	});

	it('GIVEN students are registered with teacher and no notification text is provided WHEN /api/retrievefornotifications is invoked THEN only non suspended students are returned.', done => {

		//GIVEN
		const student1 = createUser('s1', 'sl1', 's1@xyz.com');
		const student2 = createUser('s2', 'sl2', 's2@xyz.com');
		const student3 = createUser('s3', 'sl3', 's3@xyz.com');
		const teacher1 = createUser('t1', 'tl1', 't1@xyz.com');

		const givenTheStudentsAndTeacher = async ()=>{
			await Student.create({...student1, suspend: true});
			await Student.create({...student2, suspend: true});
			await Student.create(student3);
			await Teacher.create(teacher1);
			const students = await findStudentWithEmailAddress([student1.email, student2.email, student3.email])
				.then(students => students) ;
			await findTeacherWithEmail(teacher1.email)
				.then(teacher=> registerStudentWithTeacher(students, teacher.id));
		};

		const retrieveForNotificationsRequest = {
			'teacher': 't1@xyz.com'
		};

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).post(retrieveForNotificationsApiUrl)
				.set('Accept', 'application/json')
				.send(retrieveForNotificationsRequest)

				//THEN
				.expect(200)
				.end((err, res)=> {
					if (err) return done(err);
					expect(res.body.recipients.length).to.be.equal(1);
					expect(res.body.recipients[0]).to.be.equal(student3.email);
					done();
				});
		});
	});

	it('GIVEN students mentioned in notification and no student is registered with teacher WHEN /api/retrievefornotifications is invoked THEN only non suspended students are returned.', done => {

		//GIVEN
		const student1 = createUser('s1', 'sl1', 's1@xyz.com');
		const student2 = createUser('s2', 'sl2', 's2@xyz.com');
		const student3 = createUser('s3', 'sl3', 's3@xyz.com');
		const teacher1 = createUser('t1', 'tl1', 't1@xyz.com');

		const givenTheStudentsAndTeacher = async ()=>{
			await Student.create(student1);
			await Student.create({...student2, suspend: true});
			await Student.create(student3);
			await Teacher.create(teacher1);
		};

		const retrieveForNotificationsRequest = {
			'teacher': 't1@xyz.com',
			'notification': 'Hi students! @s2@xyz.com @s3@xyz.com'
		};

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).post(retrieveForNotificationsApiUrl)
				.set('Accept', 'application/json')
				.send(retrieveForNotificationsRequest)

				//THEN
				.expect(200)
				.end((err, res)=> {
					if (err) return done(err);
					expect(res.body.recipients.length).to.be.equal(1);
					expect(res.body.recipients[0]).to.be.equal(student3.email);
					done();
				});
		});
	});

	it('GIVEN invalid teachers email WHEN /api/retrievefornotifications is invoked THEN 422 status code is returned.', done => {

		//GIVEN
		const retrieveForNotificationsRequest = {
			'teacher': 'delete from teaher;',
			'notification': 'Hi students! @s2@xyz.com @s3@xyz.com'
		};

		//WHEN
		const response = sendPostRequest(retrieveForNotificationsApiUrl, app, retrieveForNotificationsRequest);

		//THEN
		validateInvalidRequestResponse(response, done);
	});
});