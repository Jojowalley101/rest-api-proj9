'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Users extends Model { }
    Users.init({
        name: {
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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The username you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'A username is required'
                },
                notEmpty: {
                    msg: 'Please provide a username'
                }
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
                len: {
                    args: [8, 20],
                    msg: 'The password should be between 8 and 20 characters in length'
                }
            }
        },
        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                if (val === this.password) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('confirmedPassword', hashedPassword);
                }
            },
            validate: {
                notNull: {
                    msg: 'Both passwords must match'
                }
            }
        }
    }, { sequelize });
    Users.associate = (models) => {
        Users.hasMany(models.Courses, {
            as: 'database',
            foreignKey: {
                allowNull: false,
            },
        });
    };

    return Users;
};


///In the Users model, add a one-to-many association between 
//the User and Course models using the hasMany() method.