/*
 * The file api_config.js is part of the dataportal project.
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
var sql = require('mssql');
var db = require('../lib/db.js');

/**
 * @brief   returns the current database configuration from the database
 * @details This call will return the number of point, the min/max value
 *          andthe data range.
 *
 * @param detector detector to be used
 * @param from [description]
 * @param till [description]
 * @param tilt [description]
 * @param cb [description]
 * @return nothing
 */
exports.getConfigData = function(detector, from, till, tilt, cb) {
    "use strict";

    var ps = new sql.PreparedStatement(db.dbConnection()),
        query = 'SELECT count(*), min(date), max(date), min(' + detector + '), max(' + detector + ') FROM TestData';

    ps.output('output_parameter', sql.Int); // count
    ps.output('output_parameter', sql.DateTime); // from
    ps.output('output_parameter', sql.DateTime); // till
    ps.output('output_parameter', sql.Int); // min
    ps.output('output_parameter', sql.Int); // max

    if (tilt !== null) {
        ps.input('tilt', sql.Int);
        query = query + ' where tilt=@tilt';
    }

    if (from !== null) {
        ps.input('d1', sql.DateTime);
        query += ' and date > @d1';
    }

    if (till !== null) {
        ps.input('d2', sql.DateTime);
        query += ' and date < @d2';
    }

    ps.prepare(query, function(err) {
        if (err) {
            cb(null, err);
            return;
        }

        ps.execute({
            tilt: tilt,
            d1: from,
            d2: till
        }, function(err, resultSet) {
            if (err) {
                cb(null, {
                    result: null,
                    resultCode: err,
                    query: query
                });
                return;
            }

            ps.unprepare(function(err) {
                if (err) {
                    cb(null, {
                        result: null,
                        resultCode: err,
                        query: query
                    });
                    return;
                }
                var result = resultSet.toTable().rows[0][0];

                cb({
                    startDate: result[1],
                    endDate: result[2],
                    count: result[0],
                    minValue: result[3],
                    maxValue: result[4],
                    tilt: tilt
                }, {
                    resultCode: err,
                    query: query
                });
            });
        });
    });
};