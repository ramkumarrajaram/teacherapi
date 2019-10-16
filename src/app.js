import registerStudentRoutes from './routes/register-student';
import commonStudentsRoutes from './routes/common-students';
import suspendStudentRoute from './routes/suspend-student';
import retrieveForNotificationsRoute from './routes/retrieve-for-notifications';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import { addStatusAndMessageToResponse } from './utils';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/register', registerStudentRoutes);
app.use('/api/commonstudents', commonStudentsRoutes);
app.use('/api/suspend', suspendStudentRoute);
app.use('/api/retrievefornotifications', retrieveForNotificationsRoute);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

//Below code register the error handler which should be after all app.use() statements.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err.stack);
	addStatusAndMessageToResponse(res, 500, 'Error occured. Please contact support if it continues to happen.');
});
export default app;
