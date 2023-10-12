const mongoose = require("mongoose");
const User = mongoose.model("users");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ limit: "2000mb", extended: true });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = 10;
const JWT_SECRET = "sdkhcbshbf3125bx2";

module.exports = (app) => {
  app.get(`/database/users`, async (req, res) => {
    let users = await User.find();
    console.log("MFA");
    return res.status(200).send(users);
  });
  app.get(`/database/users/:user`, async (req, res) => {
    const { user } = req.params;
    let users = await User.where("username").equals(user);
    return res.status(200).send(users);
  });

  app.post(`/database/users`, jsonParser, async (req, res) => {
    let user = await User.create(req.body);
    return res.status(201).send({
      error: false,
      user,
    });
  });

  //AUTHENTICATION METHOODD!!!
  app.post("/database/users/signup", jsonParser, async (req, res) => {
    // geting our data from frontend
    const { name, username, password: plainTextPassword } = req.body;
    // encrypting our password to store in database
    const password = await bcrypt.hash(plainTextPassword, salt);
    try {
      // storing our user data into database
      const response = await User.create({
        name,
        username,
        password,
      });
      console.log(response);
      return res.send(response);
    } catch (error) {
      console.log(JSON.stringify(error));
      if (error.code === 11000) {
        return res.send({ status: "error", error: "username already exists" });
      }
      throw error;
    }
  });

  const verifyUserLogin = async (username, password) => {
    try {
      const user = await User.findOne({ username }).lean();
      if (!user) {
        return { status: "error", error: "user not found" };
      }
      if (await bcrypt.compare(password, user.password)) {
        // creating a JWT token
        token = jwt.sign(
          { id: user._id, username: user.username, type: "user" },
          JWT_SECRET,
          { expiresIn: "2h" }
        );
        return { status: "ok", data: token };
      }
      return { status: "error", error: "invalid password" };
    } catch (error) {
      console.log(error);
      return { status: "error", error: "timed out" };
    }
  };

  app.post("/database/users/signin", jsonParser, async (req, res) => {
    const { username, password } = req.body;
    // we made a function to verify our user login
    const response = await verifyUserLogin(username, password);
    console.log(response);
    if (response.status === "ok") {
      // storing our JWT web token as a cookie in our browser
      res.cookie("token", token, {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
      }); // maxAge: 2 hours
      return res.send(response);
    } else {
      res.json(response);
    }
  });

  //Auth End

  app.get(`/database/users/login/verifyToken`, async (req, res) => {
    console.log(token, req.cookies);
    const { token } = req.cookies;

    try {
      const verify = jwt.verify(token, JWT_SECRET);
      console.log(verify.username, verify);
      if (verify.type === "user") {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (error) {
      console.log(JSON.stringify(error), "error");
      res.status(200).send(false);
    }
  });

  app.put(`/database/users/:username`, jsonParser, async (req, res) => {
    const { username } = req.params;
    let user = await User.findOneAndUpdate(
      { username },
      req.body
      //   { upsert: false },
      //   function (err, doc) {
      //     if (err) return res.send(500, { error: err });
      //     return res.send("Succesfully saved.");
      //   }
    );
    return res.status(202).send({
      error: false,
      user,
    });
  });

  app.delete(`/database/users/:id`, async (req, res) => {
    const { id } = req.params;

    let user = await User.findByIdAndDelete(id);

    return res.status(202).send({
      error: false,
      user,
    });
  });
};
