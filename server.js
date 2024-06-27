const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
const multer = require('multer');

// db
const connection = require("./db/connection.js");
// model
const Friends = require('./db/models/friends_model');
const Furnitures = require('./db/models/furnitures_model');

const categoriesRoutes = require("./router/category_router.js");
const Sponsors = require('./router/sponsors_router.js')
const productRouter = require('./router/product.js')
const product_sub_Router = require('./router/sub_product.js')
const subCategoryRouter = require('./router/sub-category.js')
const PORT = 5000;
const app = express();

// basic frontend middleware
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.set(express.static('public'));
// cors err
app.use(cors({ origin: '*' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware for handling static files
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use('/uploads/furnitures', express.static(path.join(__dirname, './uploads/furnitures')));
app.use('/uploads/sponsors', express.static(path.join(__dirname, './uploads/sponsors')));
app.use('/uploads/products', express.static(path.join(__dirname, './uploads/products')));
app.use('/uploads/sub-product', express.static(path.join(__dirname, './uploads/sub-product')));
app.use('/uploads/ironworks', express.static(path.join(__dirname, './uploads/ironworks')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", require("./router/auth_router.js"));
 app.use('/api', require('./router/contact_router.js'));
app.use("/api", require("./router/friends_router.js"));
app.use("/api", require("./router/furnitures_router.js"));
app.use("/api", require("./router/sponsors_router.js"));
app.use("/api", require("./router/category_router.js"));
app.use("/api", require("./router/product.js"));
app.use("/api", require("./router/sub_product.js"));
app.use("/api", require("./router/sub-category.js"));
app.use("/api", require("./router/ironworks_router.js"));
app.use('/api/categories', categoriesRoutes);
app.listen(PORT, () => {
  // server build
  console.log(`https://localhost:${PORT}` + " Port running");
  // database
  connection();

})
