export default (sequelize, DataTypes) => {
	const Student = sequelize.define('Student', {
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		suspend: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, 
	{		
		indexes:[
			{unique:true, fields: ['email']}
		],
		freezeTableName: true,
		tableName: 'student'
	});
	Student.associate = function(models) {
		models.Student.belongsToMany(models.Teacher, {through:'TeacherStudent'});
	};
	return Student;
};