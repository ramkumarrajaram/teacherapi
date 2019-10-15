import commonStudentsService from '../services/CommonStudentsService';

class CommonStudentsController {
    static getCommonStudents(req, res) {
        res.send(commonStudentsService.getCommonStudents(req, res));
    }
}
export default CommonStudentsController;