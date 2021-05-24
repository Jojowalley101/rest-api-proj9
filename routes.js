'use strict';

const Courses = require('./models').Courses;

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

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));


// /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
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
    const dataCourses = await Courses.findAll();
    res.json(dataCourses);
    //res.render("index", { book: dataCourses, title: "My Awesome Courses" });
}));


// /api/courses /: id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.

router.get("/courses/:id", asyncHandler(async (req, res, next) => {
    try {
        const usersingleID = await Courses.findOne({ where: { id: req.params.id } });
        //console.log(req.params.id);
        //res.render("update", { book: usersingleID, title: usersingleID.title });
    } catch (error) {
        if (error.status === 404) {
            const errorNotFound = new Error('Error, page not found');
            errorNotFound.status = 404;
            console.log(errorNotFound.status, errorNotFound.message);
            next(errorNotFound);
        } else {
            const errorServer = new Error('Server error');
            errorServer.status = 500;
            console.log(errorServer.status, errorServer.message);
            next(errorServer);
        }
    }
}));


// /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.

// // // /* POST create new course. */
router.post('/users/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Courses.create(req.body);
        ///res.redirect("/users");
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Courses.build(req.body);
            //res.render("new", { book: book, errors: error.errors, title: "New Courses" });
        } else {
            throw error;
        }
    }
}));



// /api/courses /: id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.

// // /* PUT update course. */
router.put("/:id", function (req, res, next) {
  Courses.findById(req.params.id).then(function (user) {
    if (user) {
      return user.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function (user) {
      res.redirect("/courses/" + user.id);
  }).catch(function (error) {
    if (error.name === "SequelizeValidationError") {
      var user = Courses.build(req.body);
      user.id = req.params.id;
        //res.render("courses/edit", { user: user, errors: error.errors, title: "Edit courses" })
    } else {
      throw error;
    }
  }).catch(function (error) {
    res.send(500, error);
  });
});



// /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.

// // /* DELETE individual course. */
router.post("/courses/:id/delete", asyncHandler(async (req, res) => {
    try {
        const bookDeleteIndividual = await Courses.findByPk(req.params.id);
        await bookDeleteIndividual.destroy();
        res.redirect("/courses");
        //console.log(req.params.id);
        //res.render("edit", { book: bookDeleteIndividual, title: bookDeleteIndividual.title });
    } catch (error) {
        throw error;
    }
}));

module.exports = router;