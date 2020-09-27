const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');

const guard = require('../middleware/guard')({
  permissions: {
    admin: 'list post get put delete'
  }
});

router.get("/", checkAuth, guard.check('list'), UsersController.list);
router.post("/", checkAuth, guard.check('post'), UsersController.create);
router.get("/:uid", checkAuth, guard.check('get'), UsersController.get_user);
router.put("/:uid", checkAuth, guard.check('put'), UsersController.update);
router.delete("/:uid", checkAuth, guard.check('delete'), UsersController.del);

module.exports = router;
