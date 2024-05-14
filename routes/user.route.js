const express = require('express');
const Route = express.Router();
const UserController= require('../controllers/user.controller');
const { middleware } = require('../middleware/auth.js');

Route.post('/user/register', UserController.register);
Route.post('/user/login', UserController.login);
Route.post('/user/uploadFile', middleware, UserController.uploadFile);

module.exports = Route;