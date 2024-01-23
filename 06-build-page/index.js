const fs = require('fs');
const path = require('path');

const fromSource = ''; //like  ./src/
const sourcePath = path.join(__dirname, fromSource);
const htmlComponentsPath = path.join(__dirname, fromSource, 'components');
const buildPath = path.join(__dirname, 'project-dist');

let htmlTemplate = '';

function buildBundle(srcPath, buildPath) {
  fs.rm(buildPath, { recursive: true, force: true }, (err) => {
    if (err) throw err;

    fs.mkdir(buildPath, { recursive: true }, (err) => {
      if (err) throw err;

      copyFolder(
        path.join(sourcePath, 'assets'),
        path.join(buildPath, 'assets'),
      );
      getCssBundle(
        path.join(sourcePath, 'styles'),
        path.join(buildPath, '', ''),
      );
      getHtmlBundle(
        path.join(sourcePath, 'template.html'),
        path.join(buildPath, 'template.html'),
        htmlComponentsPath,
      );
    });
  });
}

function getHtmlBundle(template, buildPath, htmlComponentsPath) {
  fs.createReadStream(template, 'utf8')
    .on('data', (data) => {
      htmlTemplate = data;
      const componentNames = htmlTemplate.match(/{{(.*)}}/gim);
      const components = {};

      fs.readdir(htmlComponentsPath, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          const parsedFile = path.parse(file.name);
          fs.createReadStream(
            path.join(htmlComponentsPath, parsedFile.base),
            'utf8',
          )
            .on('data', (data) => {
              components[`{{${parsedFile.name}}}`] = data;
              if (componentNames.length === Object.keys(components).length) {
                for (let i = 0; i < componentNames.length; i++) {
                  htmlTemplate = htmlTemplate.replace(
                    componentNames[i],
                    '\n' + components[componentNames[i]],
                  );
                }

                fs.writeFile(
                  buildPath,
                  htmlTemplate
                    .split('\n')
                    .filter((line) => line.trim() !== '')
                    .join('\n'),
                  (err) => {
                    if (err) throw err;
                  },
                );
              }
            })
            .on('error', (err) => {
              throw err;
            });
        });
      });
    })
    .on('error', (err) => {
      throw err;
    });
}

function getCssBundle(src, build) {
  const cssBundle = path.join(build, 'style.css');
  fs.writeFile(cssBundle, '', (err) => {
    if (err) throw err;

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        let parsedFilePath = path.parse(file.name);
        if (file.isFile() && parsedFilePath.ext === '.css') {
          fs.readFile(
            path.join(src, parsedFilePath.base),
            'utf8',
            (err, data) => {
              if (err) throw err;

              fs.appendFile(cssBundle, data + '\n', (err) => {
                if (err) throw err;
              });
            },
          );
        }
      });
    });
  });
}

function copyFile(srcFile, destFile) {
  fs.copyFile(srcFile, destFile, (err) => {
    if (err) throw err;
  });
}

function copyFolder(src, build) {
  fs.mkdir(build, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      else
        files.forEach((file) => {
          const sourePath = path.join(src, file.name);
          const destinationPath = path.join(build, file.name);

          if (file.isFile()) copyFile(sourePath, destinationPath);
          else copyFolder(sourePath, destinationPath);
        });
    });
  });
}

buildBundle(sourcePath, buildPath);
