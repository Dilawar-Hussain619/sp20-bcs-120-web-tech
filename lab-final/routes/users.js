var express = require("express");
var router = express.Router();
const User = require("../models/user");

// Middleware for validating user input
const validateUserInput = (req, res, next) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password || !role) {
    return res.status(400).send("All fields are required");
  }

  next();
};

router.get("/new", (req, res) => {
  res.render("new-user-form");
});

router.post("/", validateUserInput, async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const newUser = new User({ name, username, password, role });
    await newUser.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { users });
  } catch (error) {
    console.error(error);
    res.send("Error fetching users");
  }
});

router.put("/:id", async (req, res) => {
  const { name, username, password, role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, {
      name,
      username,
      password,
      role,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send("Error updating user");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send("Error deleting user");
  }
});

router.get("/:id/edit", validateUserInput, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("edit-user-form", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user for editing");
  }
});

router.put("update/:id", async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name,
      username,
      password,
      role,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

module.exports = router;
