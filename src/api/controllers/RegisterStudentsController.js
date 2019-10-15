import registerStudentsService from '../services/RegisterStudentsService';

class RegisterStudentsController {
    static registerStudents(req, res) {
        res.send(registerStudentsService.registerStudents(req, res));
    }
}
export default RegisterStudentsController;