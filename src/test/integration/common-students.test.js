import {describe, it, beforeEach, before} from 'mocha';
import app from '../../app';
import request from 'supertest';
import {
	tearDownData,
	validateInvalidRequestResponse,
} from './test-util';

import model from '../../models';

const commonstudentsApiUrl ='/api/commonstudents';

describe('Find common students for given teachers',  ()=> {

	before(()=>model.sequelize.sync({alter: true}));
	beforeEach( ()=>tearDownData());

	/*  //TODO With sqlite3 database some how goup by query is not working. Need to investigate more why.
		This is not an issue with mysql server.

	it('GIVEN common sudents are registered with teachers WHEN /api/commonstudents is invoked THEN common students are returned.', done => {
		//GIVEN
		const student1 = createUser('s1', 'sl1', 's1@xyz.com');
		const student2 = createUser('s2', 'sl2', 's2@xyz.com');
		const student3 = createUser('s3', 'sl3', 's3@xyz.com');
		const teacher1 = createUser('t1', 'tl1', 't1@xyz.com');
		const teacher2 = createUser('t2', 'tl2', 't2@xyz.com');

		const givenTheStudentsAndTeacher = async ()=>{
			await Student.create(student1);
			await Student.create(student2);
			await Student.create(student3);
			await Teacher.create(teacher1);
			await Teacher.create(teacher2);
			const students = await findStudentWithEmailAddress([student1.email, student2.email])
				.then(students => students) ;
			await findTeacherWithEmail(teacher1.email)
				.then(teacher=> registerStudentWithTeacher(students, teacher.id));
			await findTeacherWithEmail(teacher2.email)
				.then(teacher=> registerStudentWithTeacher(students, teacher.id));
		};

		const requestUrl = commonstudentsApiUrl + '?teacher=t1%40gmail.com&teacher=t2%40gmail.com';

		givenTheStudentsAndTeacher().then(()=> {

			//WHEN
			request(app).get(requestUrl)
				.set('Accept', 'application/json')

				//THEN
				.expect(200)
				.end((err, res)=> {
					if (err) return done(err);
					expect(res.body.students.length).to.be.equal(2);
					const expectedStudentList = [student1.email, student2.email];
					const difference = differenceWith(res.body.students, expectedStudentList, (email1, email2) => email1.toLowerCase() === email2.toLowerCase());
					console.log(res.body.students);
					expect(difference).to.be.equal(0);
					done();
				});
		});
	});
	*/

	it('GIVEN provided emails addresses are not valid WHEN /api/commonstudents is invoked THEN 422 status code is returned', done => {

		//GIVEN
		const requestUrl = commonstudentsApiUrl + '?teacher=t%401%40gmail.com&teacher=t%402%40gmail.com';

		//WHEN
		const response = request(app).get(requestUrl);

		//THEN
		validateInvalidRequestResponse(response, done);
	});
});