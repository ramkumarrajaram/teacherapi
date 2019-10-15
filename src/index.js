import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import route from './api/routes/MainRouter';

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [
    {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
//app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Log requests to the console.
app.use(logger('dev'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
    res.send(ads);
});

app.use('/api', route);

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});

export default app;