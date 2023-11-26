const userRouter = require('express').Router();
const {
    signup,
    login,
    searchUser,
    userData,
} = require('../../controller/users.controller');
const { authentication } = require('../../middlewares/authentication');

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/info', authentication, userData);
userRouter.get('/search', searchUser);

module.exports = userRouter;
