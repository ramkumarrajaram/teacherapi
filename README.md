# teacher-api

``` 
//on local
git clone https://github.com/ramkumarrajaram/teacherapi
cd teacher-api
npm install
npm start
```

# Dependencies
```
npm install --save body-parser
npm install --save cors
npm install --save debug
npm install --save debug
npm install --save express
npm install --save helmet
npm install --save jest
npm install --save jwks-rsa
npm install --save morgan
npm install --save mysql2
```

# Database Migration

Initialize sequelize using the following command. 
This will create the config script, migrations and models directory

```
sequelize init 
```

```
sequelize-cli dependency is added for database migraton 
Use the following command for creation of database tables using sequelize cli

sequelize model:create --name Teacher --attributes email:string
sequelize model:create --name Student --attributes email:string,issuspended:boolean
sequelize model:create --name TeacherStudents --attributes teacherId:integer,studentId:integer
```

Once the tables, models are created run the following command for DB migration

```
sequelize db:migrate 
```