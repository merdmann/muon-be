/*
 * The file test_spec.js is part of the dataportal project.
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
  * @brief 
  * @details [long description]
  * @return [description]
  */

/*jslint node: true */

var api = require('../../lib/api_config.js');
var db = require('../../lib/db.js');

describe("Getting Configuration Data", function() {
    "use strcit";
    var theFrom = null,
        theTill = null;


    beforeEach(function(done) {
        db.dbInitialize(function() {
            console.log("Database connection online.\n");
            done();
        });
    });

    // .................................................................................

    describe("with undefined range", function() {
        var theTilt = 90,
            theError = null,
            theResult = 0;

        beforeEach(function(done) {
            api.getConfigData('d1', null, null, theTilt, function(result, error) {
                //console.log(result);

                theResult = result;
                theError = error;
                done();
            });
        });

        it("should yield some none empty data", function() {
            expect(theError.resultCode).toBeNull();
            expect(theResult.count).toBeGreaterThan(0);

            theFrom = theResult.startDate;
            theTill = theResult.endDate;
        });

    });

    // .................................................................................

    describe("with a given range", function() {
        var theTilt = 90,
            theError = null,
            theResult = 0;

        beforeEach(function(done) {
            api.getConfigData('d1', theFrom, theTill, theTilt, function(result, error) {
                //console.log(result);

                theResult = result;
                theError = error;
                done();
            });
        });

        it("should yield some none empty data", function() {
            expect(theError.resultCode).toBeNull();
            expect(theResult.count).toBeGreaterThan(0);
        });

    });

    describe("wrong detector", function() {
        var theTilt = 90,
            theError = null,
            theResult = 0;

        beforeEach(function(done) {
            api.getConfigData('wrong detector', theFrom, theTill, theTilt, function(result, error) {
                //console.log(result);

                theResult = result;
                theError = error;
                done();
            });
        });

        it("should yield some empty data", function() {
            expect(theResult).toBeNull();
            console.log( theError );
        });

    });
});