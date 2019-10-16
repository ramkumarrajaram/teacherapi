import app from './app';
import http from 'http';
import model from './models';

//Below statement creates the database. This is just for demo purpose.
model.sequelize.sync({alter: true});
var port = process.env.PORT || 3000;
var server = http.createServer(app);
server.listen(port);