// Copyright 2012 Mark Cavage, Inc.  All rights reserved.

'use strict';

var http = require('http');
var url = require('url');
var sprintf = require('util').format;

var assert = require('assert-plus');
var mime = require('mime');
var Negotiator = require('negotiator');
var uuid = require('uuid');

var dtrace = require('./dtrace');




/// From response
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
