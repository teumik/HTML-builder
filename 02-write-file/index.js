// const fs = require('fs');
// const { stdin, stdout } = process;
// const path = require('path');
// const filePath = path.join(__dirname, 'text.txt');
// const output = fs.createWriteStream(filePath, 'utf-8');

// stdout.write('Enter some text or word: (to see the changes, reopen text.txt)\n');

// stdin.on('data', data => {
//   const input = data.toString().trim();
//   if (input === 'exit') {
//     stdout.write('Edited is over, Bye!\n');
//     process.exit();
//   }
//   output.write(data);
// });

// process.on('SIGINT', () => {
//   stdout.write('\nEdited is over, Bye!\n');
//   process.exit();
// });

const { stdin: input, stdout: output } = process;
const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');
const readline = require('readline');
const rl = readline.createInterface({ input, output });
const writeStream = fs.createWriteStream(textFile, 'utf-8');

rl.write('Enter some text or word:\n');

rl.on('line', (data) => {
  if (data === 'exit') {
    output.write('Edited is over, Bye!\n');
    rl.close();
  } else {
    writeStream.write(data + '\n');
  }
});

rl.on('SIGINT', () => {
  output.write('Edited is over, Bye!\n');
  rl.close();
});
