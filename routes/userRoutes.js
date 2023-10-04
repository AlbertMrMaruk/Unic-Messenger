// const mongoose = require("mongoose");
// const Product = mongoose.model("users");

// module.exports = (app) => {
//   app.get(`/api/user`, async (req, res) => {
//     console.log(req);
//     let products = await Product.find();
//     return res.status(200).send(products);
//   });

//   app.post(`/api/user`, async (req, res) => {
//     console.log(req);
//     let product = await Product.create(req.body);
//     return res.status(201).send({
//       error: false,
//       product,
//     });
//   });

//   //   app.put(`/api/product/:id`, async (req, res) => {
//   //     const {id} = req.params;

//   //     let product = await Product.findByIdAndUpdate(id, req.body);

//   //     return res.status(202).send({
//   //       error: false,
//   //       product
//   //     })

//   //   });

//   //   app.delete(`/api/product/:id`, async (req, res) => {
//   //     const {id} = req.params;

//   //     let product = await Product.findByIdAndDelete(id);

//   //     return res.status(202).send({
//   //       error: false,
//   //       product
//   //     })

//   //   })
// };
