'use strict';

const { Courses } = require('./models');
const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { Users } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

/**
 * Create the User Routes
 * Create the following routes:
 * A /api/users GET route that will return the currently authenticated user along 
 * with a 200 HTTP status code.
 * A /api/users POST route that will create a new user, set the Location header to "/", 
 * and return a 201 HTTP status code and no content.
 */

// /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.

// Route that returns one user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    //console.log(user);
    let authUser = await Users.findAll({where: {id: user.id}});
    res.status(200).json(authUser);
}));

// /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    let user;
    try {
        user = await Users.create(req.body);
        //console.log(req.body);
        res.location('/').status(201).end();
        //res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));


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

// /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.

// /* GET courses listing. */
router.get('/courses', asyncHandler(async (req, res) => {
    const dataCourses = await Courses.findAll({
        include: {
            model: Users,
            attributes: ['firstName', 'lastName']
        }
    });
    res.status(200).json(dataCourses);
}));

// /api/courses /: id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.

router.get("/courses/:id", asyncHandler(async (req, res) => {

        const usersingleID = await Courses.findByPk(req.params.id, {
            include: {
                model: Users,
                attributes: ['firstName', 'lastName']
            }
        });
        res.status(200).json(usersingleID);
}));

// /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.

// // // /* POST create new course. */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Courses.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
       
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));



// /api/courses /: id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.

// // /* PUT update course. */
router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {

    const courseFinderUpdate = await Courses.findByPk(req.params.id);
        // { where: {
        //     model: Users,
        //     attributes: ['firstName', 'lastName']
        // }
    if (req.currentUser.id !== courseFinderUpdate.userId) {
        res.status(403).end();
    } else {
        try {
            //if (req.currentUser.id )
            await Courses.update(req.body, {where: {id: req.params.id}});
            res.status(204).end();
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
            
        }
    }
}));

// /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.

// // /* DELETE individual course. */
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {

        const courseDeleteIndividual = await Courses.findByPk(req.params.id);
        if (req.currentUser.id !== courseDeleteIndividual.id) {
            res.status(403).end();
        } else {
            await courseDeleteIndividual.destroy();
            res.status(204).end();
        }
}));

module.exports = router;