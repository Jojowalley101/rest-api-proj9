'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Courses extends Model { }
    Courses.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: true,
            },
    }, { sequelize });

    Courses.associate = (models) => {
        Courses.belongsTo(models.Users, {
            foreignKey: "userId"
        });
    };

    return Courses;
};

// Course.belongsTo(User, {
//     through: User,
// });