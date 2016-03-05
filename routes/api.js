/*
 * The file display.js is part of the dataportal project.
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

/*TODO: refactoring is needed to sperate the API logic from the routing */
/*jslint node: true */

var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../lib/db.js');
var random = require('../lib/random.js');

/**
 * Get Data for a given date range of a given detector
 *
 * @param  {[type]} '/data/:args' the url /api/data/:args
 * @param  {[type]} function   call back to be called for this routs
 * @return {void}               none
 */
router.get('/data/:args', function (req, res, ignore) { 
    "use strict";

    var args = JSON.parse(req.params.args),
        detector = args.detector,
        startDate = new Date(args.startDate),
        endDate = new Date(args.endDate),
        tilt = args.tilt,
        compression = args.compression,
        ps = new sql.PreparedStatement(db.dbConnection()),
        query = 'select date, ' + detector + ' ' +
                'from TestData ' +
                'where ' +
                'tilt=@tilt ' +
                'and (abs(cast(checksum( newid(), date ) % 134217727 as float) / 134217727) < ' + compression + ')';

    console.log("compression: " + compression);

    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    if (args.startDate) {
        query += 'and @d1<date ';
        ps.input('d1', sql.DateTime);
    }

    if (args.endDate) {
        query += 'and date<@d2 ';
        ps.input('d2', sql.DateTime);
    }

    ps.input('tilt', sql.Int);

    ps.output('output_parameter', sql.DateTime); // date
    ps.output('output_parameter', sql.Int); // detector value

    console.log(startDate + ', ' + endDate + ', ' + tilt);
    console.log(query);

    ps.prepare(query, function (err) {
        if (err) {
            res.json({data: null, result: err, query: query});
            return;
        }

        ps.execute({tilt: tilt, d1: startDate, d2: endDate}, function (err, resultSet) {
            if (err) {
                res.json({data: null, result: err, query: query});
                return;
            }

            var value = resultSet.toTable().rows,
                result = [],
                i;

            for (i = 0; i < value.length; i = i + 1) {
                result.push({
                    date: value[i][0],
                    value: value[i][1]
                });
            }

            ps.unprepare(function (err) {
                if (err) {
                    //TODO: what to do if everthing failes ... 
                    console.log("++++ error ");
                }
            });

            res.json({data: result, result: err, query: query});

        });
    });
});

/**
 * This call returns the configuration data for a given tilt.
 *
 * curl -i -X GET http://localhost:3000/api/config/<tilt>/
 */
router.get('/config/:args', function (req, res, ignore) {
    "use strict";

    var args = JSON.parse(req.params.args),
        ps = new sql.PreparedStatement(db.dbConnection()),
        tilt = args.tilt,
        detector = args.detector,
        startDate = null,
        endDate = null,
        query = 'SELECT count(*), min(date), max(date), min(' + detector + '), max(' + detector + ') FROM TestData';

    if (tilt !== null) {
        ps.input('tilt', sql.Int);
    }
    ps.output('output_parameter', sql.Int);
    ps.output('output_parameter', sql.DateTime);
    ps.output('output_parameter', sql.DateTime);
    ps.output('output_parameter', sql.Int);
    ps.output('output_parameter', sql.Int);

    if (tilt !== null) {
        query = query + ' where tilt=@tilt';
    }

    if (args.startDate !== null) {
        query += ' and date > @d1';
        ps.input('d1', sql.DateTime);
        startDate = new Date(args.startDate);
    }

    if (args.endDate !== null) {
        query += ' and date < @d2';

        ps.input('d2', sql.DateTime);
        endDate = new Date(args.endDate);
    }

    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    ps.prepare(query, function (err) {
        if (err) {
            res.json({
                result: null,
                resultCode: err,
                query: query
            });
            return;
        }

        ps.execute({
            tilt: tilt,
            d1: startDate,
            d2: endDate
        }, function (err, resultSet) {
            if (err) {
                res.json({
                    result: null,
                    resultCode: err,
                    query: query
                });
                return;
            }

            ps.unprepare(function (err) {
                if (err) {
                    res.json({
                        result: null,
                        resultCode: err,
                        query: query
                    });
                    return;
                }
                var result = resultSet.toTable().rows[0][0];

                res.json({
                    result: {
                        startDate: result[1],
                        endDate: result[2],
                        count: result[0],
                        minValue: result[3],
                        maxValue: result[4],
                        tilt: tilt
                    },
                    resultCode: err,
                    query: query
                });
            });
        });
    });
});

/**
 * @brief [brief description]
 * @details [long description]
 *
 * @param q [description]
 * @param s [description]
 * @param e [description]
 * @return [description]
 */
router.get('/tilt/:args', function (req, res, ignore) {
    "use strict";
    var ps = new sql.PreparedStatement(db.dbConnection()),
        tilt = [],
        query = 'SELECT distinct tilt  FROM TestData';

    ps.output('output_parameter', sql.Int);

    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    ps.prepare(query, function (err) {
        if (err) {
            res.json({result: null, resultCode: err, query: query});
            return;
        }

        ps.execute({}, function (err, resultSet) {
            if (err) {
                res.json({result: null, resultCode: err, query: query});
                return;
            }

            ps.unprepare(function (err) {
                if (err) {
                    res.json({result: null, resultCode: err, query: query});
                    return;
                }

                var value = resultSet.toTable().rows, i;

                for (i = 0; i < value.length; i = i + 1) {
                    tilt.push(value[i][0]);
                }
                console.log('tilt: ' + tilt);
                res.json({result: tilt, resultCode: err, query: query});
            });
        });
    });
});

/**
 * This can be used to insert data into the test data db
 *
 * curl -i -H 'Content-Type: application/json' -X PUT  -d '{ "date" : "2015-11-13", "time" : "6:1:6", "ci" : "12", "d1" : "111", "d2" : "111", "tilt
" : "190" }' http://localhost:3000/api/data
 *
 */
router.put('/data', function (req, res, ignore) {
    "use strict";

    var ps = new sql.PreparedStatement(db.dbConnection()),
        date = new Date(req.body.date + " " + req.body.time),
        query = 'INSERT INTO TestData VALUES ( @date, @d1, @d2, @ci, @tilt )',
        args = {
            date: date,
            d1: req.body.d1,
            d2: req.body.d2,
            ci: req.body.ci,
            tilt: req.body.tilt
        };

    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    ps.input('date', sql.DateTime);
    ps.input('d1', sql.Int);
    ps.input('d2', sql.Int);
    ps.input('ci', sql.Int);
    ps.input('tilt', sql.Int);

    ps.prepare(query, function (err) {
        if (err) {
            res.json({
                resultCode: err,
                query: query
            });
            return;
        }

        ps.execute(args, function (err, ignore) {
            if (err) {
                res.json({
                    resultCode: err,
                    query: query
                });
                return;
            }

            ps.unprepare(function (err) {
                if (err) {
                    res.json({
                        resultCode: err,
                        query: query
                    });
                    return;
                }
                res.json({
                    resultCode: err,
                    query: query
                });
            });
        });
    });
});

/**
 * return a series of random numbers
 */
router.get('/random/:args', function (req, res, ignore) {
    "use strict";

    var args = JSON.parse(req.params.args),
        items = 8,
        bits = 8,
        request = new sql.Request(db.dbConnection()),
        resultCode = null,
        query = "";

    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    // build the query
    if (args.items) {
        items = args.items;
    }

    if (args.bits) {
        bits = args.bits;
    }
    query = 'select top ' + bits * items + ' * from TestData';

    request.query(query, function (err, recordSet) {
        var data = [];

        if (err) {
            resultCode = err;
        } else {
            resultCode = 0;
        }

        data = random.generateRandom(bits, items, recordSet);
        res.json({resultCode: resultCode, data: data, query: query});
    });
});

module.exports = router;
