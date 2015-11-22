/*
 * The file page.js is part of the dataportal project.
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
 * This is the hardcoded page layout which has a header section; a content section
 * and a footer section.
 *
 * All static contents created in a view is copied and put into the center
 * section of the layout. West and east part of the layout are disabled.
 */
/*global window $ */
/*jslint node: true */

var api = require("./api.js");

/**
 * Update the status of the databased every 10 seconds
 */
function updateDBStatus() {
    "use strict";

    api.getConfigData('d1', null, null, null, function (from, till, min, max, count) {
        $('#ui-status').replaceWith('<span id="ui-status">' + count + ' items</span>');
        window.setTimeout(updateDBStatus, 10000);
    });
}

/**
 * @brief [brief description]
 * @details [long description]
 *
 * @return [description]
 */
exports.setTitle = function (title) {
    "use strict";

    $('#ui-title').replaceWith('<span id="ui-title">' + title + '</span>');

};

/**
 * Create the layout of the page (see http://layout.jquery-dev.com/index.cfm). The
 * callback iscalled when the document has become available and is been framed
 * in the layot.
 */
exports.createPage = function (callback) {
    "use strict";

    api.initialize();

    $(document).ready(function () {
        updateDBStatus();

        if (callback) {
            callback();
        }
    });
};
