/*
 * The file db.js is part of the dataportal project.
 *
 * The MIT License (MIT) applies.
 *
 * Copyright (c) 2015 Michael Erdmann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint node: true */

var sql = require('mssql');
var async = require('async');

var config = {
    user: 'dbadmin@olj4sccdye',
    password: 'yaq1!QAY',
    server: 'olj4sccdye.database.windows.net',
    database: 'michaelslab-muondata',
    requestTimeout: 120000,

    options: {
        encrypt: true // Use this if you're on Windows Azure
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000
    }
};

var connection;

exports.dbInitialize = function (cb) {
    "use strict";
    async.parallel([
        function (callback) {
            connection = new sql.Connection(config, function (err) {
                switch (err) {
                case sql.ELOGIN | sql.ETIMEOUT | sql.EINSTLOOKUP | sql.ESOCKET:
                    callback("Connection error");
                    break;
                case sql.EALREADYCONNECTED | sql.EALREADYCONNECTING:
                    callback("Allready connted!");
                    break;
                default:
                    callback();
                    break;
                }
            });
        }
    ], function (err) {
        if (!err) {
            cb(null);
        } else {
            cb(err);
        }
    });
};

exports.dbConnection = function () {
    "use strict";
    return connection;
};
