'use strict';

const auth = require('basic-auth');
const { User: Users } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

    if (credentials) {
        const user = await Users.findOne({ where: { username: credentials.name } });
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.confirmedPassword);
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.username}`);

                // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};


