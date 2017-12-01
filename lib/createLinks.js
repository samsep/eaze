function formatLink(pageIndex) {
  const offset = pageIndex * 36;
  const url = 'https://www.npmjs.com/browse/depended?offset=';
  return `${url}${offset}`;
}

function createLinks(count) {
  const numberOfPages = Math.ceil(count / 36);
  const links = [];
  for (let i = 0; i < numberOfPages; i++) {
    links.push(formatLink(i));
  }
  return links;
}

module.exports = createLinks;

