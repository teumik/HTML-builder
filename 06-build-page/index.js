const { exit } = process;
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const styles = path.join(__dirname, 'styles');
const destFolder = path.join(__dirname, 'project-dist');

const targetCopy = path.join(__dirname, 'assets');
const destCopy = path.join(destFolder, 'assets');

const components = path.join(__dirname, 'components');
const originHtml = path.join(__dirname, 'template.html');
const targetHtml = path.join(destFolder, 'index.html');

// CHECK AND REMOVE DESTINATION FOLDER

fsPromises.rm(destFolder, { recursive: true, force: true })
  .then(makeBundle)
  .catch(error => console.error(error.message));

function makeBundle() {

  // CREATE DESTINATION FOLDER

  fs.mkdir(destFolder, { recursive: true }, error => {
    if (error) {
      console.error(error.message);
      exit();
    }

    // CREATE BUNDLE.CSS

    fs.readdir(styles, { withFileTypes: true }, (error, files) => {
      if (error) {
        console.error('WARNING: no such styles directory, bundler skip this step');
        return;
      }

      const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
      const bundleFile = fs.createWriteStream(bundlePath, 'utf-8');

      files.forEach(file => {
        const newPath = path.join(styles, file.name);
        const ext = path.extname(newPath);

        if (ext === '.css' && file.isFile()) {
          const input = fs.createReadStream(newPath, 'utf-8');
          let stylesData = '';

          input.on('data', data => {
            stylesData += data;
          });

          input.on('end', () => {
            bundleFile.write(`${stylesData}\n\n`);
          });
        }
      });
    });

    // COPY ASSETS FOLDER

    fs.mkdir(destCopy, { recursive: true }, error => {
      if (error) {
        console.error(error.message);
        exit();
      }

      function deepCopy(targetCopy, destCopy) {
        fs.readdir(targetCopy, { withFileTypes: true }, (error, files) => {
          if (error) {
            console.error('WARNING: no such assets directory, bundler skip this step');
            return;
          }

          files.forEach(file => {
            if (file.isDirectory()) {
              const newTarget = path.join(targetCopy, file.name);
              const newDest = path.join(destCopy, file.name);
              fs.mkdir(newDest, { recursive: true }, error => {
                if (error) {
                  console.error(error.message);
                  exit();
                }
              });
              deepCopy(newTarget, newDest);
            } else if (file.isFile()) {
              const filePath = path.join(targetCopy, file.name);
              const copyFilePath = path.join(destCopy, file.name);

              fs.copyFile(filePath, copyFilePath, error => {
                if (error) {
                  console.error(error.message);
                  exit();
                }
              });
            }
          });
        });
      }

      deepCopy(targetCopy, destCopy);
    });

    // HTML

    const inputHtmlStream = fs.createReadStream(originHtml, 'utf-8');
    const outputHtmlStream = fs.createWriteStream(targetHtml);

    outputHtmlStream.write('');
    let html = '';

    inputHtmlStream.on('data', data => {
      html += data.toString();
    });

    inputHtmlStream.on('end', () => {
      fs.readdir(components, { withFileTypes: true }, (error, files) => {
        if (error) {
          console.error('WARNING: no such components directory, bundler skip this step');
          return;
        }

        let count = files.length - 1;

        files.forEach(file => {
          const filePath = path.join(components, file.name);
          fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
              console.error(error.message);
              exit();
            }

            const regexp = new RegExp(`{{${path.parse(filePath).name}}}`, 'g');

            const tabRegexp = new RegExp(`(?<=\n)(([ \t]+)(?={{${path.parse(filePath).name}}}))`, 'g');
            // (?<=\n)(([ \t]*)(?=[<\w\/])) // REGEXP FOR DATA STRING
            const tab = html.match(tabRegexp) || '';
            const dataArr = data.split('\n');
            const newData = dataArr.map((el, i) => i !== 0 ? el = '\n' + tab + el : el).join('');
            html = html.replace(regexp, `${newData}`);

            if (count === 0) {
              outputHtmlStream.write(html);
            } else {
              count--;
            }
          });
        });
      });
    });

  });

}
