/*
 * The file api.js is part of the dataportal project.
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

/**
 * This file contains the client side of the API to retrieve data from the
 * server.
 */

/*jslint node: true */
/*global console, require, restful, window */

var api = null;
/**
 * @brief Initialize the interface to the server
 * @details THis methid either takes an argument
 *
 * @param init Initialize the API
 * @return none
 */
exports.initialize = function(init) {
    'use strict';
    var port, server;

    if (!init) {
        port = window.location.port;
        server = window.location.hostname;
    } else {
        port = init.port;
        server = init.server;
    }

    //console.log("port: " + port + ", server: " + server);
    api = restful(server).port(port);
};


/**
 * retrive the configuration data from and call the callback when it
 * has become available.
 *
 * @param  {String}     detector 'D1', 'D2', 'CI'
 * @param  {Number}     tilt     tilt of the detector in degrees
 * @param  {Date/Time}  begin    begin of the time intervall
 * @param  {Date/Time}  end      end of the time intervall
 * @param  {Function}   callback [description]
 * @return {[void]}     None
 */
exports.getConfigData = function(detector, tilt, begin, end, callback) {
    'use strict';

    var args = {
        detector: detector,
        startDate: begin,
        endDate: end,
        tilt: tilt
    };

    api.one('api/config', JSON.stringify(args)).get().then(function(response) {
        var config = response.body().data(),
            count = config.result.count,
            from = config.result.startDate,
            till = config.result.endDate,
            min = config.result.minValue,
            max = config.result.maxValue;

        if (callback) {
            return callback(from, till, min, max, count);
        }
    });
};

/**
 * This functuion requests data from the server
 */
exports.requestData = function(detector, tilt, begin, end, compression, callback) {
    "use strict";

    var args = {
        detector: detector,
        startDate: begin,
        endDate: end,
        tilt: tilt,
        compression: compression
    };

    console.log(args);

    api.one("api/data", JSON.stringify(args)).get().then(
        function(response) {
            var b = response.body().data();

            if (callback) {
                callback(args, b.data);
            }
        },
        function(ignore) {
            callback(null, null);
        }
    );
};

exports.requestRandom = function(items, bits, callback) {
    "use strict";

    var args = {
        items: items,
        bits: bits
    };

    api.one("api/random", JSON.stringify(args)).get().then(
        function(response) {
            var b = response.body().data();

            if (callback) {
                callback(b.data);
            }
        },
        function(ignore) {
            if (callback) {
                callback(null);
            }
        }
    );
};

/**
 * Query the list if avaialable tilts in the database. If there are no tilts
 * in the databased the callback will be called with an empty array. In all
 * other cases it is null.
 *
 * @param  {Function} callback [the function to be called after the query]
 * @return {void}              [none]
 */
exports.getTilts = function(callback) {
    "use strict";

    var args = {};

    api.one("api/tilt", JSON.stringify(args)).get().then(
        function(response) {
            var b = response.body().data();

            if (callback) {
                callback(b.result);
            }
        },
        function(ignore) {
            if (callback) {
                callback(null, b);
            }
        }
    );
};