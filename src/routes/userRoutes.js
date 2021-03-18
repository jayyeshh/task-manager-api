const express = require("express");
const router = new express.Router();
const sharp = require("sharp");
const User = require("../models/user");
const multer = require("multer");
const auth = require("../middleware/auth");

// router.get("/users", auth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).send(users);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.get("/user/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "email", "password"];
    const areValidUpdatesOnly = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!areValidUpdatesOnly) throw new Error();
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/gm)) {
      return cb(new Error("Please upload file with proper extension only!"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    throw new Error("500 Internal Server Error!");
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch {
    res.status(404).send();
  }
});

module.exports = router;
