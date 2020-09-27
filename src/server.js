const http = require('http');
const url = require('url');
const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) =>
{
	let jumpTable = {
		// "/": (args) => responses.getHTML(request, response),
		"/": responses.getHTML,
		"/index": responses.getHTML,
		"/style.css": responses.getStyles,
		"/getUsers": () => {
			switch (request.method) {
				case 'HEAD':
					responses.headUsers(request, response);
					break;
				case 'GET':
				default:
					responses.getUsers(request, response);
					break;
			}
		},
		"/notReal": () => {
			switch (request.method) {
				case 'HEAD':
					responses.head404(request, response);
					break;
				case 'GET':
				default:
					responses.get404(request, response);
					break;
			}
		},
		"/addUser": () => {
			switch (request.method) {
				case 'POST':
					responses.postUser(request, response);
					break;
				case 'GET':
				default:
					responses.get404(request, response);
					break;
			}
		},
		"404": responses.get404,
	};
	console.log(request.url);
	let plainURL;
	// if ((request.url + "").indexOf("?") > 0)
	// 	plainURL = (request.url + "").substring(0, (request.url + "").indexOf("?"));
	// else
	// 	plainURL = (request.url + "");
	// console.log(request.host);
	// console.log(request.path);
	// console.log(request);
	let parsedURL = new url.URL(request.url, `http://${request.headers.host}`);//"http://127.0.0.1:3000/"
	// console.log(parsedURL);
	plainURL = parsedURL.pathname;
	console.log(plainURL);
	// if (typeof(jumpTable[request.url]) != "function") {
	if (typeof(jumpTable[plainURL]) != "function") {
		jumpTable[404](request, response);
	}
	else {
		// jumpTable[request.url](request, response);
		jumpTable[plainURL](request, response);
	}
}

console.log("Server starting up...");

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}`);