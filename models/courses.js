'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class Courses extends Model { }
    Courses.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A name is required'
                },
                notEmpty: {
                    msg: 'Please provide a name'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: ''
                },
                notEmpty: {
                    msg: ''
                }
            }
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false
            },
            validate: {
                notNull: {
                    msg: ''
                }
            }
        }
    }, { sequelize });

    return Courses;
};


//Users.hasMany(Courses)
//Courses.belongsTo(Users);