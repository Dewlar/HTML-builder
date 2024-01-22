const { createWriteStream } = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const stream = createWriteStream(path.join(__dirname, '02-write-file.txt'));

stream.on('error', (err) => exit(`writeStream Error: ', ${err.message}`));
process.stdout.write('Hello! Write somethings: \n');
process.stdin.on('data', (data) =>
  data.toString().toLowerCase().trim() === 'exit' ? exit() : stream.write(data),
);
process.on('SIGINT', () => exit());

function exit(message = 'Bye. Have a nice day!') {
  process.stdout.write(message);
  process.exit(1);
}
