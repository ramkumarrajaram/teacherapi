import suspendStudentService from '../services/SuspendStudentService';

class SuspendStudentController {
    static suspendStudent(req, res) {
        res.send(suspendStudentService.suspendStudent(req, res));
    }
}
export default SuspendStudentController;