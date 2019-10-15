import  registerStudentsController from '../controllers/RegisterStudentsController';import  commonStudentsController from '../controllers/CommonStudentsController';import  suspendStudentController from '../controllers/SuspendStudentController';import  retrieveNotificationController from '../controllers/RetrieveNotificationController';import Router from 'express';import ResponseUtil from '../util/ResponseUtil';let router = Router();const responseUtil = new ResponseUtil();router.use(function interpretData(req, res, next)  {    let apiKey = req.header('x-teacher-api-key');    if (apiKey === null|| apiKey === undefined) {        responseUtil.setError(401, "Invalid api key.");        responseUtil.send(res);    }    next()});router.post("/register", function(req, res) {    res.send(registerStudentsController.registerStudents(req, res))});router.get("/commonstudents", function(req, res) {    res.send(commonStudentsController.getCommonStudents(req, res))});router.post("/suspend", function(req, res) {    res.send(suspendStudentController.suspendStudent(req, res))});router.post("/retrievefornotifications", function(req, res) {    res.send(retrieveNotificationController.retrieveNotification(req, res))});module.exports = router;