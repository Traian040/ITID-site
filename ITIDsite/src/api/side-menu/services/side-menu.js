'use strict';

/**
 * side-menu service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::side-menu.side-menu');
