const fs = require('fs');
const path = require('path');
const { stdout } = process;

const read = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';

read.on('data', chunk => data += chunk);
read.on('end', () => {
  stdout.write(data);
});
read.on('error', error => {
  stdout.write(error.message);
  stdout.write('\n');
});
