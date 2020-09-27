const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.list = (req, res, next) => {
  var page_size = req.query.page_size ? parseInt(req.query.page_size) : 50;
  const page_nr = (req.query.pg ? parseInt(req.query.pg) : 1) - 1;
  var rq = req.query
  var q = {}
  if (rq.t) {
    var re = new RegExp(rq.t, 'i');
    q.$or = [{ username: re}, { email: re }];
  }
  if (rq.roles) {
      q.roles = { $in: rq.roles.split(',') };
  }
  User.countDocuments(q)
    .then((docs_count) => {
    User.find(q)
      .skip(page_size * page_nr)
      .limit(page_size)
      .sort({_id: -1})
      .then((users) => {
        return res.jsondata({
            items: users,
            pagination: {
              total: docs_count,
              page: page_nr + 1,
              // pages: docs_count > 0 ? (Math.ceil(docs_count/page_size)) : 1,
              page_size: page_size,
            }
        });
      });
      /*.catch(err => {
        return res.jsondata({
          err: 'An error occured.',
          data: []
        });
      });*/
    })
    .catch(err => {
      return res.jsondata({
        err: 'An error occured.',
        data: []
      });
    });
}

exports.create = (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    email: req.body.email,
    avatar: req.body.avatar,
    roles: req.body.roles,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
  });
  user.save()
    .then(result => {
      res.jsondata({
        message: "Created user successfully",
        createdUser: {
          username: result.username,
          _id: result._id,
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
}

exports.get_user = (req, res, next) => {
  const uid = req.params.uid;
  User.findById(uid)
    .select("username email _id as uid enabled roles avatar")
    .exec()
    .then(doc => {
      if (doc) {
        res.jsondata(doc);
      }
      else {
        res.jsondata({message: "No valid entry found"}, 404, 40004);
      }
    })
    .catch(err => {
      console.log(err);
      res.jsondata({error: err},500, 50005);
    })
}

exports.update = (req, res, next) => {
  const id = req.params.uid;
  const updateOps = req.body;
  if (updateOps.password) {
    updateOps.password = bcrypt.hashSync(updateOps.password, bcrypt.genSaltSync(10));
  }

  User.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.jsondata({
        message: "User updated",
        ops: updateOps,
        request: {
          type: "GET",
          url: "http://localhost:3000/users/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.del = (req, res, next) => {
  const id = req.params.uid;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.jsondata({
        message: "Successfully deleted",
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}
