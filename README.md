## Software stack used.
* Node latest version.
* Docker to start the mysql database container. If you have on locally installed then don't need docker.
* Express.
* Sequelize as ORM.
* Sqlte3 for database integration testing.
* Mocha for async testing.
* Chai for testing assertion.
* Lodash. Util function JS lib.
* Eslint for reducing the common issues.
* Babel for transpiling latest js code to older version that node support.


#### Database name is testdb and db user right now is root and password is password in the ./config/config.json file. Please make a change if needed. For demo purpose application creates the schema by itself.

## To Create the Database run the following command
``` 
npm run db-premigrate
```

## To access the database
```
mysql --user=root --password
Enter the password as root user password.
```

## To start the application. App will start wt port 3000 by default. To override it please create and env variable with name PORT.
```
npm run start
```

## To execute the test cases.
```
npm run test
```

## To access the application.
```
http://localhost:3000
```

## Postman Collection
```
https://www.getpostman.com/collections/7d95530c946c1d7be33a
```

## Free hosting to access the application on internet.
```
Not done yet. Working on it. Will provide soon.
```

## Open issues
#### Found wiered behaviour with sqlte3 with group by clause. It doesn't work as expected as in mysql. Need some investigations to solve this problem. For common student end point, integration test is currently commented out. But request validation is being done.

## Decision made.

#### Unit/Integration Testing. I decided to use the sqlite3 in memory version to write the integration test cases which covers the end to end flow of an API and test the integration with the database. Ideally it should be with the same database as in production. This can also be done with scripts to run docker instance of mysql.

#### Used Sequelize as ORM for database interaction. This made interaction with database easy a very good abstraction over writing the SQL queries but it doesn't block to write native SQL if needed.

#### To stop SQL injections. I am validating the input type and raising the error if not in valid format with Http code 422.

## Added below endpoints to create the Teacher and Student accounts.

I have not added any tests cases for these two endpoints.

Http Method: Post

/api/students

{
	"firstName":"fn",
	"lastName":"ln",
	"email":"fn@gmail.com"
}

Http Method: Post

/api/teachers

{
	"firstName":"fn",
	"lastName":"ln",
	"email":"fn@gmail.com"
}
