const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (app) => {
  app.get(`/database/users`, async (req, res) => {
    console.log(req);
    let users = await User.find();
    return res.status(200).send(users);
  });

  app.post(`/database/users`, async (req, res) => {
    console.log(req.body);
    let product = await User.create(req.body);
    return res.status(201).send({
      error: false,
      product,
    });
  });

  app.put(`/database/users/:id`, async (req, res) => {
    const { id } = req.params;

    let product = await Product.findByIdAndUpdate(id, req.body);

    return res.status(202).send({
      error: false,
      product,
    });
  });

  app.delete(`/database/users/:id`, async (req, res) => {
    const { id } = req.params;

    let product = await Product.findByIdAndDelete(id);

    return res.status(202).send({
      error: false,
      product,
    });
  });
};
