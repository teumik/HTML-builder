const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Enter some text or word: (to see the changes, reopen text.txt)\n');

stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    stdout.write('Edited end, Bye!\n');
    process.exit();
  }
  output.write(data);
})

process.on('SIGINT', () => {
  stdout.write('\nEdited is over, Bye!\n');
  process.exit();
})
