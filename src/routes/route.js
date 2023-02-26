const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")
const studentController = require("../controllers/studentController")
const { authentication, authorisation } = require("../middlewares/auth")

//user
router.post("/register", userController.createUser)
router.post("/login", userController.login)
router.post("/logout", userController.logout)

//student
router.post("/student", authentication, studentController.createStudent)
router.get("/student", authentication, studentController.getStudent)

//update
router.put("/student/:studentId", authentication, authorisation, studentController.updateStudent)
router.delete("/student/:studentId", authentication, authorisation, studentController.deleteStudent)


router.all('/*', function (req, res) {
    res.status(400).send({ status: false, message: "Invalid URL" })
})

module.exports = router;
