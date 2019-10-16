import express from 'express';
import model from '../models';

const {Teacher} = model;
const teacherRoutes = express.Router();

teacherRoutes.post('/', (req, res)=>{
	Teacher.count({
		where: {
			email: req.body.email
		}
	}).then((count)=>{
		if(count==0){
			Teacher.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email
			}).then((user)=>{
				res.send(user);
			});
		}else{
			res.status(409);
			res.send({ 'message': 'User already exist in system with email : '  + req.body.email});
		}
	});
});

export default teacherRoutes;