const User = require("../../src/models/user");
const Task = require("../../src/models/task");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const _id = new mongoose.Types.ObjectId();
const userTwoId=new mongoose.Types.ObjectId();
const userOne = {
  _id,
  email: "user1@email.com",
  name: "user1",
  password: "user1@pass",
  tokens: [
    {
      token: jwt.sign({ _id }, process.env.JWT_SECRET),
    },
  ],
};
const userTwo = {
  _id: userTwoId,
  email: "user2@email.com",
  name: "user2",
  password: "user2@pass",
  tokens: [
    {
      token: jwt.sign({ userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 1",
  completed: true,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 2",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 3",
  completed: false,
  owner: userTwo._id,
};

const taskFour = {
  _id: new mongoose.Types.ObjectId(),
  description: "task 4",
  completed: false,
  owner: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  await new Task(taskFour).save();
};

module.exports = {
  _id,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  setupDatabase,
};
