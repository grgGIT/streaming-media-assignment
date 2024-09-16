const fs = require('fs');
const path = require('path');

// Reusable function to stream any file
const loadFile = (request, response, filePath, contentType) => {
  const file = path.resolve(__dirname, `../client/${filePath}`);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('File not found');
      } else {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Server error');
      }
      return;
    }

    let { range } = request.headers;
    if (!range) {
      range = 'bytes=0-';
    }
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunkSize = (end - start) + 1;

    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
    });

    const stream = fs.createReadStream(file, { start, end });
    stream.on('open', () => {
      stream.pipe(response);
    });
    stream.on('error', () => {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Server error');
    });
  });
};

const getParty = (request, response) => {
  loadFile(request, response, 'party.mp4', 'video/mp4');
};

const getBling = (request, response) => {
  loadFile(request, response, 'bling.mp3', 'audio/mpeg');
};

const getBird = (request, response) => {
  loadFile(request, response, 'bird.mp4', 'video/mp4');
};

module.exports = { getParty, getBling, getBird };
