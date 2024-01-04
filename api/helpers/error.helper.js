const _const = require('../../config/constant');

exports.Ok = function(message) {
  this.status = 200;
  this.success = true;
  this.level = _const.level.info;
  this.message = message;
  this.message.trim();
};

exports.Created = function(message) {
  this.status = 201;
  this.success = true;
  this.level = _const.level.info;
  this.message = message;
  this.message.trim();
};

exports.NoContent = function(message) {
  this.status = 204;
  this.success = true;
  this.level = _const.level.info;
  this.message = message;
  this.message.trim();
};

exports.BadRequest = function(message) {
  this.status = 400;
  this.success = false;
  this.level = _const.level.warn;
  this.message = message;
  this.message.trim();
};

exports.Unauthorized = function(message) {
  this.status = 401;
  this.success = false;
  this.level = _const.level.warn;
  this.message = message;
  this.message.trim();
};

exports.NotFound = function(message) {
  this.status = 404;
  this.success = false;
  this.level = _const.level.warn;
  this.message = message;
  this.message.trim();
};

exports.RequestTimeout = function(message) {
  this.status = 408;
  this.success = false;
  this.level = _const.level.warn;
  this.message = message;
  this.message.trim();
};

exports.InternalServerError = function(message) {
  this.status = 500;
  this.success = false;
  this.level = _const.level.error;
  this.message = message;
  this.message.trim();
};
