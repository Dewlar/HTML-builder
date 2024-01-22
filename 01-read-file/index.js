const { createReadStream } = require('node:fs');
const { stdout } = require('node:process');
const path = require('node:path');

const pathFile = path.join(__dirname, 'text.txt');

createReadStream(pathFile, 'utf8')
  .on('error', (err) => console.log('Reading error: ', err.message))
  .pipe(stdout);
