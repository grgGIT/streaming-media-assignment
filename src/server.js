const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3001;

const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/party.mp4':
      mediaHandler.getParty(request, response);
      break;

    default:
      htmlHandler.getIndex(request, response);
      break;
  }
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('Hello, World!');
  response.end();
};

const server = http.createServer(onRequest);

server.listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
