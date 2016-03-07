/*
 * The file test_spec.js is part of the dataportal project.
 *
 * The MIT License (MIT) applies.
 *
 * Copyright (c) 2015 Michael Erdmann
 *
 * Permission is hereb
 * y granted, free of charge, to any person obtaining a copy
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
var api = require('../../scripts/api.js');

describe("The backend server API", function () {
    var theDetector = 'd1';
    var theTilt = 0,
        theMin = 0,
        theMax = 0,
        theCount = 0,
        theFrom = 0,
        theTill = 0;


    beforeEach(function () {
        api.initialize({ port: 3000, server: "localhost" });
    });

    // ............................................................................

    describe("fetches the configuration Data", function () {

        beforeEach(function (done) {

            api.getConfigData(theDetector, null, null, null,
                function (from, till, min, max, count) {
                    theMin = min;
                    theMax = max;
                    theCount = count;
                    theFrom = from;
                    theTill = till;

                    done();
                });
        });

        it("should yield some none empty data", function () {
            expect(theCount).toBeGreaterThan(0);
            expect(theMax).toBeGreaterThan(theMin);
        });
    });

    // ............................................................................
    describe("fetches Random Data", function () {
        var theSize = 0;
        var reqSize = 8;
        var reqBits = 14;

        beforeEach(function (done) {
            api.requestRandom(reqSize, reqBits, function (data) {
                theSize = data.length;
                done();
            });
        });

        it("should yield some none empty data", function () {
            expect(theSize).toBeGreaterThan(0);
            expect(theSize).toEqual(reqSize);
        });

        it("should return the request number of items", function () {
            expect(theSize).toEqual(reqSize);
        });
    });

    // ..........................................................................
    describe("fetches tilts", function () {
        var theTilts = null;

        beforeEach(function (done) {
            api.getTilts(function (tilts) {
                theTilts = tilts;
                done();
            });
        });

        it("should yield some none empty data", function () {
            expect(theTilts.length).toBeGreaterThan(0);
        });
    });

    // .........................................................................
    describe("fetches all available data", function () {
        var theData = null;
        var theArgs = null;

        beforeEach(function (done) {
            api.requestData(theDetector, theTilt, theFrom, theTilt, 0.5,
                function (args, data) {
                    theData = data;
                    theArgs = args;

                    done();
                });
        });

        it("should yield some none empty data", function () {
            expect(theCount).toBeGreaterThan(0);
            expect(theData).toBeArray();
            //expect(theData.length).toBeGreaterThan(0);
            expect(theData.length).toBeLessThan(theCount);
        });
    });
});
