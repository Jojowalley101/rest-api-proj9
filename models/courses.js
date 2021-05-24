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
            allowNull: false,
        },

        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false
            },
    }, { sequelize });

    Courses.associate = (models) => {
        Courses.belongsTo(models.Users, {
            as: 'database',
            foreignKey: {
                allowNull: false,
            },
        });
    };

    return Courses;
};

// Course.belongsTo(User, {
//     through: User,
// });