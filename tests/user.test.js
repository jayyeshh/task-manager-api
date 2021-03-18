const { _id, userOne, setupDatabase } = require("./fixtures/db");
const User = require("../src/models/user");
const request = require("supertest");
const app = require("../src/app");

beforeEach(setupDatabase);

test("should register a new user!", async () => {
  const response = await request(app)
    .post("/user")
    .send({
      email: "user2@mail.com",
      name: "user2",
      password: "user2@pass",
    })
    .expect(201);

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      email: "user2@mail.com",
      name: "user2",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("user2@pass");
});

test("should login a existing user!", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login user with wrong credentials!", async () => {
  await request(app)
    .post("/login")
    .send({
      email: userOne.email,
      password: "wrongPassword",
    })
    .expect(400);
});

test("should fetch profile of logged in user!", async () => {
  await request(app)
    .get("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile of unauthenticated user!", async () => {
  await request(app).get("/user/me").send().expect(401);
});

test("should delete loggedIn user's account!", async () => {
  const response = await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(_id);
  expect(user).toBeNull();
});

test("should not delete account of unauthenticated user!", async () => {
  await request(app).delete("/user/me").send().expect(401);
});

test("should upload avatar image!", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid fields!", async () => {
  const resp = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "changed name",
    });
  const user = await User.findById(resp.body._id);
  expect(user.name).toBe("changed name");
});

test("should not update invalid field!", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      username: "changed username",
    })
    .expect(400);
});
