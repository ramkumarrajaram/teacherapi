import retrieveNotificationService from '../services/RetrieveNotificationService';

class RetrieveNotificationController {
    static retrieveNotification(req, res) {
        res.send(retrieveNotificationService.retrieveNotification(req, res));
    }
}
export default RetrieveNotificationController;