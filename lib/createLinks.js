'use strict';

/**
 * Create links for pages we want to scrape
 * @param {number} count - number of packages
 * @returns {Array} - array of paginated url strings
 */
function createLinks(count) {
  const numberOfPages = Math.ceil(count / 36);
  const links = [];
  for (let i = 0; i < numberOfPages; i++) {
    links.push(formatLink(i));
  }
  return links;
}
/**
 * Create url with offset query param matching npm site's pagination
 */
function formatLink(pageIndex) {
  const offset = pageIndex * 36;
  const url = 'https://www.npmjs.com/browse/depended?offset=';
  return `${url}${offset}`;
}


module.exports = createLinks;

