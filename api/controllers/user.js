const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log('Found something...')
    })
  return res.status(200).json({
    message: 'Nothing...'
  })
}

exports.info = (req, res, next) => {
  User.findOne({_id: req.userData.uid}, function(err, u){
    if (err) {
      console.log(err);
      return res.jsondata({message: 'Failed to get info'}, 401, 50008);
    }
    if (u) {
      return res.jsondata({
        roles: u.roles,
        username: u.userame,
        name: u.username,
        avatar: u.avatar,
      });
    }
    else return res.jsondata({message: 'Failed to get info'}, 401, 50008);
  });
};

exports.user_login = (req, res, next) => {
  User.find({ username: req.body.username, enabled: true })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.jsondata({msg: 'Auth failed'}, 200, 40001)
      }
      if (bcrypt.compareSync(req.body.password, user[0].password)) {
        const token = jwt.sign(
          {
            uid: user[0]._id,
            roles: user[0].roles,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
        );
        return res.status(200).json({
          code: 20000,
          data: {
            message: "Auth successful",
            token: token
          }
        });
      } else {
        return res.jsondata({
          message: "Auth failed here"
        }, 200, 40001);
      }
    })
    .catch(err => {
      console.log(err);
      return res.jsondata({msg: 'Auth failed'}, 200, 40001)
    });
};

exports.logout = (req, res) => {
  console.log('User logged out...');
  return res.jsondata({
    message: 'OK',
  });
}

exports.user_signup2 = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(result => {
            console.log(result);
            return res.status(201).json({
              message: "User created"
            });
          })
          .catch(err => {
            console.log(err);
            return res.status(500).json({
              error: err
            });
          });
      }
    }).catch(err => {
      return res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
