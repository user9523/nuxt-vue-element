'use strict';

const BaseController = require('./base');

class UserController extends BaseController {
  async info() {
    this.success({
      name: 'back',
    });
  }
}

module.exports = UserController;
