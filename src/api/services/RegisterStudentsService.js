import express from 'express';
import { isEmpty, isArray } from 'lodash';
import ValidationUtil from '../util/ValidationUtil';
import ResponseUtil from '../util/ResponseUtil';
import model from '../../../models'

const validationUtil = new ValidationUtil();
const responseUtil = new ResponseUtil();

class RegisterStudentsService {
    static registerStudents(req, res) {

        this.validateRequest(req, res);

        try {

            //req.body.
            //database.Sequelize.
        } catch (e) {

        }
        res.send("New Service Testing");
    }

    static validateRequest(req, res) {
        let teacher = req.body.teacher;
        let students = req.body.students;
        if (teacher === null|| teacher === undefined || students === null|| students === undefined) {
            responseUtil.setError(400, "Bad request!!");
            responseUtil.send(res);
        }

        this.validateTeacher(req, res);
        this.validateStudent(req, res);
    }

    static validateTeacher(req, res) {
        let teacherEmail = req.body.teacher;
        if (validationUtil.isNotValidEmail(teacherEmail)) {
            responseUtil.setError(422, "Teacher Email Address is invalid");
            responseUtil.send(res);
        }
    }

    static validateStudent(req, res) {
        let studentEmails = req.body.students;
        if(!validationUtil.isValidEmailInArray(studentEmails)){
            responseUtil.setError(422, "One or more student's or students' email address or addresses is or are invalid");
            responseUtil.send(res);
        }
    }
}

export default RegisterStudentsService;