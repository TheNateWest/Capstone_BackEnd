const express = require("express");
const usersController = require("../Controllers/users");
const router = express.Router();

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.get("/", usersController.getAllUsers)
router.get("/:id", usersController.getUserById)
router.put("/update-user/:id", usersController.updateUser)
router.delete("/delete-user/:id", usersController.deleteUser)

module.exports = router