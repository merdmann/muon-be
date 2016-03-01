/*
 * The file random.js is part of the dataportal project.
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

exports.generateRandom = function(bits, items, recordset) {
        "use strict";

        var bit = 0,
            next = 0,
            di = 0,
            val = 0,
            rec = 0,
	    data = [];

        for (di = 0; di < items; di += 1) {
            val = 0;

            for (bit = 0; bit < bits; bit += 1) {
                rec = recordset[next];
                if ((rec.d1 + rec.d2 + rec.ci) & 1) {
                    val = val | (1 << bit);
                }
                next = next + 1;
            }
            data.push(val);
        }
        return data;
};
