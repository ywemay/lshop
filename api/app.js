const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");


const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const usersRoutes = require('./routes/users');
const avatarRoutes = require('./routes/avatar');
// const dbLink = "mongodb://misterone:secretpass@localhost:27017/noderestshop";

mongoose.connect(process.env.DB_LINK , {
// mongoose.connect(dbLink , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
},
err => {
  console.log('Failed to connect');
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Token, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Token, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  res.jsondata = function (data, status=200, code=20000) {
    var json = {code, data};
    return this.status(status).json(json);
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);
app.use("/users", usersRoutes);
app.use("/avatar", avatarRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
