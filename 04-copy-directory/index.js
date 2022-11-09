const fs = require('fs');
const { exit } = process;
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyPath, { recursive: true }, error => {
  if (error) {
    console.error(error.message);
    exit();
  }

  fs.readdir(copyPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error(error.message);
      exit();
    }

    files.forEach(file => {
      const copyFilePath = path.join(copyPath, file.name);
      fs.unlink(copyFilePath, error => {
        if (error) {
          console.error(error.message);
          exit();
        }
      });
    });

    fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
      if (error) {
        console.error(error.message);
        exit();
      }
      files.forEach(file => {
        const filePath = path.join(folderPath, file.name);
        const copyFilePath = path.join(copyPath, file.name);

        fs.copyFile(filePath, copyFilePath, error => {
          if (error) {
            console.error(error.message);
            exit();
          }
        });
      });
    });
  });
});
