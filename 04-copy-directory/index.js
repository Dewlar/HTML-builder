const fs = require('node:fs');
const path = require('node:path');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

function copyFile(srcFile, destFile) {
  fs.copyFile(path.join(srcFile), path.join(destFile), (err) => {
    if (err) console.log(err.message);
    // console.log(path.basename(srcFile), '\t\tfile was copied');
  });
}

function copyFolder(src, dest) {
  fs.rm(dest, { recursive: true, force: true }, () => {
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) console.log(err.message);
      else {
        // console.log(path.basename(dest), '\t\tfolder was created');
        fs.readdir(src, { withFileTypes: true }, (err, files) => {
          if (err) console.log(err.message);

          files.forEach((file) => {
            const sourePath = path.join(src, file.name);
            const destinationPath = path.join(dest, file.name);

            if (file.isFile()) copyFile(sourePath, destinationPath);
            else copyFolder(sourePath, destinationPath);
          });
        });
      }
    });
  });
}

copyFolder(sourceFolder, destinationFolder);
