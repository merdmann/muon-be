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
exports.getConfigData = function (detector, from, till, tilt, cb) {
    "use strict";

    var ps = new sql.PreparedStatement(db.dbConnection()),
        query = 'SELECT count(*), min(date), max(date), min(' + detector + '), max(' + detector + ') FROM TestData';

    ps.output('output_parameter', sql.Int);             // count
    ps.output('output_parameter', sql.DateTime);        // from
    ps.output('output_parameter', sql.DateTime);        // till
    ps.output('output_parameter', sql.Int);             // min
    ps.output('output_parameter', sql.Int);             // max

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

    ps.prepare(query, function (err) {
        if (err) {
            cb(null, err);
            return;
        }

        ps.execute({tilt: tilt, d1: from, d2: till}, function (err, resultSet) {
            if (err) {
                cb(null, {result: null, resultCode: err, query: query});
                return;
            }

            ps.unprepare(function (err) {
                if (err) {
                    cb(null, {result: null, resultCode: err, query: query});
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
                }, {resultCode: err, query: query});
            });
        });
    });
};
