'use strict';

const Courses = require('./models').Courses;
const bcrypt = require('bcryptjs');


// async handler
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)

        } catch (error) {
            res.status(500).send(error);

        }
    }
}

/**
 * Create the User Routes
 * Create the following routes:
 * A /api/users GET route that will return the currently authenticated user along 
 * with a 200 HTTP status code.
 * A /api/users POST route that will create a new user, set the Location header to "/", 
 * and return a 201 HTTP status code and no content.
 */

const express = require('express');
// const { asyncHandler } = require('./middleware/async-handler');
const Users  = require('./models').Users;
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.

// Route that returns one user.
router.get('/users', asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));


// /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const body = req.body;
        body.password = bcrypt.hashSync(req.body.password, salt);
        await User.create(req.body);

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
    //res.render("index", { book: dataCourses, title: "My Awesome Courses" });
}));


// /api/courses /: id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.

router.get("/courses/:id", authenticateUser, asyncHandler(async (req, res, next) => {

        const usersingleID = await Courses.findByPk(req.params.id, {
            include: {
                model: Users,
                attributes: ['firstName', 'lastName']
            }
        });
        res.status(200).json(usersingleID);
    }));
        
    // } catch (error) {
    //     if (error.status === 404) {
    //         const errorNotFound = new Error('Error, page not found');
    //         errorNotFound.status = 404;
    //         console.log(errorNotFound.status, errorNotFound.message);
    //         next(errorNotFound);
    //     } else {
    //         const errorServer = new Error('Server error');
    //         errorServer.status = 500;
    //         console.log(errorServer.status, errorServer.message);
    //         next(errorServer);
    //     }
    // }


// /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.

// // // /* POST create new course. */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Courses.create(req.body);
        res.location(`/courses/${course.id}`).status(201).end();
        ///res.redirect("/users");
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            course = await Courses.build(req.body);
            //res.render("new", { book: book, errors: error.errors, title: "New Courses" });
        } else {
            throw error;
        }
    }
}));



// /api/courses /: id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.

// // /* PUT update course. */
router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    const courseFinderUpdate = await Courses.findByPk(req.body.params);

    if (req.currentUser.id !== course.id) {
        res.status(403).end();
    } else {
        try {
            const course = await Courses.update(req.body);
            res.status(204).end();
        } catch (error) {
            if (error.name === 'SequelizeValisationError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
            
        }
    }
}));


   //const course = await Courses.update(req.body);

    // if else to see if user id is valid


// /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.

// // /* DELETE individual course. */
router.post("/courses/:id/delete", authenticateUser, asyncHandler(async (req, res) => {

        const courseDeleteIndividual = await Courses.findByPk(req.params.id);
        if (req.currentUser.id !== course.id) {
            res.status(403).end();
        } else {
        await courseDeleteIndividual.destroy();
        res.status(204).end();
    }
        //res.redirect("/courses");
        //console.log(req.params.id);
        //res.render("edit", { book: bookDeleteIndividual, title: bookDeleteIndividual.title });
    
}));

module.exports = router;