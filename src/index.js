"use strict";

/**
 * The OpeningHours data structure.
 * @type {OpeningHours}
 */
exports.OpeningHours = require("./lib/openinghours");

/**
 * Parses the given string and returns an opening hours object.
 * @type {function}
 * @param {string} str opening hours in a human readable format
 */
exports.parseHours = require("./lib/parser");
