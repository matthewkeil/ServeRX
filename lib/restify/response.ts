var http = require('http');
var sprintf = require('util').format;
var url = require('url');
var assert = require('assert-plus');
var mime = require('mime');
var errors = require('restify-errors');
var httpDate = require('./http_date');
var utils = require('./utils');
///--- Globals
var InternalServerError = errors.InternalServerError;
// make custom error constructors
errors.makeConstructor('FormatterError');
