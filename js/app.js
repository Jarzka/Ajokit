"use strict"; // NOTE: Once the app is built, all JS files are concatenated together and this affects all files.

/* The one and the only global variable to be used in this app... */
var TRAFFICSIM_APP = {};

/* ...almost. Many files need to use module.exports to export themselves for unit tests on Node.js.
 * Such functionality does not exist in the frontend so we create dumb objects for this purpose. */
var module = {};
module.exports = {};