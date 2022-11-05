const fs = require('fs');
const { stdout, exit } = process;
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

function fileLog(folderPath) {
  fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error(error.message);
      exit();
    }

    files.forEach(file => {
      const newPath = path.join(folderPath, file.name);
      if (file.isDirectory()) {
        // CODE FOR DEEP RECURSIVE

        // const newPath = path.join(folderPath, file.name);
        // fileLog(newPath);
      } else if (file.isFile()) {
        fs.stat(newPath, (error, stats) => {
          if (error) {
            console.error(error.message);
            exit();
          }
          stdout.write(
            `${path.parse(newPath).name} - ${path.parse(newPath).ext.slice(1)} - ${stats.size / 1024}kb`
          );
          stdout.write('\n');
        })
      }
    })
  })
}

fileLog(folderPath);
