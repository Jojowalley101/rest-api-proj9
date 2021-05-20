'use strict';


/**
 * Create the User Routes
 * Create the following routes:
 * A /api/users GET route that will return the currently authenticated user along 
 * with a 200 HTTP status code.
 * A /api/users POST route that will create a new user, set the Location header to "/", 
 * and return a 201 HTTP status code and no content.
 */








/**
 * Create the Courses Routes
 * Create the following routes:
 * /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
 * /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.
 * /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
 * /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
 * /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
 * 
 */













const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
        name: user.name,
        username: user.username
    });
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;