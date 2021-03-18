const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
  _id,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create task for user!", async () => {
  const response = await request(app)
    .post("/task")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "task created from test suit!",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
  expect(task.description).toBe("task created from test suit!");
});

test("should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("should not delete other user's task", async () => {
  const response = await request(app)
    .delete(`/task/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
    const task=await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});
