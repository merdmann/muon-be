/*
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
 * 
 * Generate Random Tables
 */

/*global d3 */
var page = require('./page.js');
var api = require("./api.js");

/**
 * { function_description }
 *
 * @method     average
 * @param      {number}  data    { description }
 * @return     {number}  { description_of_the_return_value }
 */
function average(data) {
    "use strict";

    var avg = 0.0,
        i = 0;

    for (i = 0; i < data.length; i = i + 1) {
        avg = avg + data[i];
    }

    return avg / data.length;
}

/**
 * @method     variance
 * @param      {number}  data    { description }
 */
function variance(data) {
    "use strict";
    var avg = average(data),
        v = 0.0,
        i = 0;

    for (i = 0; i < data.length; i = i + 1) {
        v = v + Math.pow(data[i] - avg, 2);
    }

    return Math.sqrt(v / Math.pow(data.length, 2));
}


/**
 * This function is beeing called to present the generated numbers
 *
 * @method     generateNumbers
 */
function generateNumbers() {
    "use strict";

    var tableLabel = d3.select("#data"),
        rowLabel,
        items = d3.select('#items').property('value'),
        bits = d3.select('#bits').property('value'),
        avgLabel = d3.select('#avg'),
        expLabel = d3.select('#expected'),
        varLabel = d3.select('#variance'),
        fmt = d3.format('>8.2f'),
        next = 0,
        i = 0,
        download = null,
        downloadLabel = null;

    api.initialize();

    if (bits === "") {
        bits = 8;
    }

    if (items === "") {
        items = 8;
    }

    // remove all old rows
    tableLabel.selectAll('tr').remove();

    api.requestRandom(items, bits, function(data) {
        while (next < data.length) {
            rowLabel = tableLabel.append('tr');

            for (i = 0; i < 10; i = i + 1) {
                if (next < data.length) {
                    rowLabel.append('td').text(data[next]).attr('class', 'data_item');
                } else {
                    rowLabel.append('td').text("").attr('class', 'data_item');
                }
                next = next + 1;
            }
        }

        if (data.length) {
            avgLabel.text(fmt(average(data)));
            expLabel.text(fmt(Math.pow(2.0, bits) / 2.0));
            varLabel.text(fmt(variance(data)));
        } else {
            avgLabel.text("No Data");
        }

        download = 'data:application/octet-stream;charset=utf-16le;base64,' + btoa(data);

        downloadLabel = d3.select('#downloadlink');
        if (downloadLabel) {
            downloadLabel.remove();
        }

        d3.select("#download")
            .append("a")
            .attr('id', 'downloadlink')
            .attr("href", download)
            .html("Download");
    });
}


/**
 * This is beeing called after the page has been setup on the
 * browser.
 */
page.createPage(function() {
    "use strict";

    /* put some default values into the input fields */
    d3.select('#items').property('value', '8');
    d3.select('#bits').property('value', '8');

    api.initialize();

    page.setTitle("Generate Random Numbers");

    document.getElementById('submit').onclick = generateNumbers;
});
