// const http = require('http');
const url = require('url');

const MIME = {
  json: 'application/json',
  css: 'text/css',
  html: 'text/html',
};

const users = {};

const parseURL = (request) => url.parse(request.url, true).query;

const respond = (request, response, content, contentType = 'application/json', statusCode = 200) => {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

// #region Get 404
const get404 = (request, response) => respond(request, response, JSON.stringify({ id: 404, message: 'Not Found' }), 'application/json', 404);
const head404 = (request, response) => respond(request, response, JSON.stringify({ id: 404 }), 'application/json', 404);
// #endregion

// #region Get Users
const getUsers = (request, response) => respond(request, response, JSON.stringify(users), 'application/json', 200);
const headUsers = (request, response) => respond(request, response, JSON.stringify({ id: 200, message: 'Success' }), 'application/json', 200);
// #endregion

const postUser = (req, res) => {
  const query = parseURL(req);
  let message; let
    code;
  if (query.name && query.age) {
    if (users[query.name]) {
      code = 204;
      message = JSON.stringify({ id: 204, message: 'No Content' });
    } else {
      code = 201;
      message = JSON.stringify({ id: 201, message: 'Created' });
    }
    users[query.name] = query.age;
  } else {
    code = 400;
    message = JSON.stringify({ id: 400, message: 'Both name and age are required.' });
  }
  respond(req, res, message, MIME.json, code);
};

// #region Get Styles
const fs = require('fs');

const styles = fs.readFileSync(`${__dirname}/../client/style.css`);
const getStyles = (request, response) => respond(request, response, styles, 'text/css');
// #endregion
// #region Get HTML
const page = fs.readFileSync(`${__dirname}/../client/client.html`);
const getHTML = (request, response) => respond(request, response, page, 'text/html');
// #endregion

module.exports = {
  getHTML,
  getStyles,
  get404,
  head404,

  getUsers,
  headUsers,
  postUser,

  parseURL,
};
// respond(request, response, `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <title>Error</title>
// </head>
// <body>

// </body>
// </html>`, "text/html");
