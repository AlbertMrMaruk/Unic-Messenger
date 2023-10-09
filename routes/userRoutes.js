const mongoose = require("mongoose");
const User = mongoose.model("users");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ limit: "2000mb", extended: true });

module.exports = (app) => {
  app.get(`/database/users`, async (req, res) => {
    let users = await User.find();
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

  app.put(`/database/users/:username`, jsonParser, async (req, res) => {
    const { username } = req.params;

    let user = await User.updateOne({ username }, req.body);

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
