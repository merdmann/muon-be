/*
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
 * 
 * Draw the diagram
 */

/*global d3 */
var page = require('./page.js');
var api = require('./api.js');
var disp = require('./display.js');


var fmt = d3.format('>12d');

/**
 * @brief Update the screen
 * @details this method is called on pressing the display button on the
 *          screen. It rebuild the diagram.
 * @return none
 */
function drawDiagram() {
    "use strict";

    var startDateLabel = d3.select('#startDate'),
        endDateLabel = d3.select('#endDate'),
        detectorLabel = d3.select('#detector'),
        rangeLabel = d3.select('#range'),
        tiltLabel = d3.select('#tilt'),
        countLabel = d3.select('#count'),
        // retrieve the data
        tilt = tiltLabel.property('value'),
        begin = startDateLabel.property('value'),
        end = endDateLabel.property('value'),
        detector = detectorLabel.property('value'),
        compression = 0.0;

    api.getConfigData(detector, tilt, begin, end, function (from, till, min, max, count) {
        compression = 900 / count;

        api.requestData(detector, tilt, begin, end, compression, function (ignore, data) {

            countLabel.text(fmt(count));
            rangeLabel.text(min + ".." + max);

            startDateLabel.property('value', from);
            endDateLabel.property('value', till);

            if (data) {
                disp.display(data, begin, end, min, max, "#diagram");
            } else {
                console.log("*** No data");
            }
        });
    });
}

/**
 * @brief fill the input mask
 * @details This fills the input mask based in the selected tilt
 * @return [description]
 */
function fillMask(tilt) {
    "use strict";

    var rangeLabel = d3.select('#range'),
        countLabel = d3.select("#count"),
        startDateLabel = d3.select('#startDate'),
        endDateLabel = d3.select('#endDate'),
        detector = d3.select('#detector').property('value');

    api.getConfigData(detector, tilt, null, null, function (from, till, min, max, count) {
        countLabel.text(fmt(count));
        rangeLabel.text(min + ".." + max);
        startDateLabel.property('value', from);
        endDateLabel.property('value', till);
    });
}

/**
 * @brief [brief description]
 * @details This creates the page layout. This is typically processed before the
 *          application code.
 * @param  -
 * @return -.
 */
page.createPage(function () {
    "use strict";

    var tiltLabel = d3.select('#tilt');

    api.initialize();
    page.setTitle("Display Measurement Data");

    api.getTilts(function (data, ignore) {
        var i;

        for (i = 0; i < data.length; i = i + 1) {
            tiltLabel.append('option').attr('value', data[i]).html(data[i]);
        }

        tiltLabel.on('change', function () {
            fillMask(tiltLabel.property('value'));
        });

        fillMask(tiltLabel.property('value'));
    });

    document.getElementById("display").onclick = drawDiagram;
});
