/*
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
 * @param  [description]
 * @return [description]
 */
exports.initialize = function (init) {
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
 * retrive the condifguration data from and call the callback when it
 * has become available.
 */
exports.getConfigData = function (detector, tilt, begin, end, callback) {
    'use strict';

    var args = {
        detector: detector,
        startDate: begin,
        endDate: end,
        tilt: tilt
    };

    api.one('api/config', JSON.stringify(args)).get().then(function (response) {
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
exports.requestData = function (detector, tilt, begin, end, compression, callback) {
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
        function (response) {
            var b = response.body().data();

            if (callback) {
                callback(args, b.data);
            }
        },
        function (ignore) {
            callback(null, null);
        }
    );
};

exports.requestRandom = function (items, bits, callback) {
    "use strict";

    var args = {
        items: items,
        bits: bits
    };

    api.one("api/random", JSON.stringify(args)).get().then(
        function (response) {
            var b = response.body().data();

            if (callback) {
                callback(b.data);
            }
        },
        function (ignore) {
            if (callback) {
                callback(null);
            }
        }
    );
};

/**
 * @brief get all tilts in the database
 * @details THis function returns a list of tilts which are stored in the database.Upon
 * receving the data the call back will be called with the data as an argument. If there
 * is any kind of error the call back will be called with the argument null!
 *
 * @param  none
 * @return data
 */
exports.getTilts = function (callback) {
    "use strict";

    var args = {};

    api.one("api/tilt", JSON.stringify(args)).get().then(
        function (response) {
            var b = response.body().data();

            if (callback) {
                callback(b.result);
            }
        },
        function (ignore) {
            if (callback) {
                callback(null,b);
            }
        }
    );
};