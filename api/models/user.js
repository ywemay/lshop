const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9_\.]+/
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    roles: [String],
    password: { type: String, required: true }
});

//const uSchema = new userSchema();
/*
var textSearch = require("mongoose-text-search");
userSchema.plugin(textSearch);
userSchema.index({
    username           :"text",
    email           :"text",
}, {
    name: "best_match_index",
    weights: {
        username: 5,
        email: 4,
    }
});*/

const User = mongoose.model('User', userSchema);

// User.remove({username: 'admin'}, function(err){ if (err) console.log(err);});
 // User.remove({}, function(err){ if (err) console.log(err);});
// if user database is empty = create admin account
User.findOne({}, function(err, u){
    if (err) {
        console.log(err);
        return;
    }
    if (u == null) {
        const uadmin = new User({
            email: 'admin@example.loc',
            username: 'admin',
            roles: ['admin', 'viewer', 'editor'],
            password: bcrypt.hashSync('111111', bcrypt.genSaltSync(10)),
            avatar: '',
        });
        uadmin.save(function(err){
            if (err) console.log(err);
            else console.log('Admin saved...');
        });
    }
});

module.exports = User;
