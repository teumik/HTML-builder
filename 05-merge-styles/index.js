const { exit } = process;
const fs = require('fs');
const path = require('path');
const origin = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(dest);

fs.readdir(origin, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.error(error.message);
    exit();
  }

  files.forEach(file => {
    const newPath = path.join(origin, file.name);
    const ext = path.extname(newPath);

    if (ext === '.css' && file.isFile()) {
      const input = fs.createReadStream(newPath, 'utf-8');
      let styles = '';

      input.on('data', data => {
        styles += data;
      });

      input.on('end', () => {
        output.write(`${styles}\n\n`);
      });
    }
  });
});
