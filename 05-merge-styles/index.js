const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(bundlePath, '', (err) => {
  if (err) throw err;

  fs.readdir(
    path.join(__dirname, 'styles'), //stylesPath
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        let parsedFilePath = path.parse(file.name);
        if (file.isFile() && parsedFilePath.ext === '.css') {
          fs.readFile(
            path.join(stylesPath, parsedFilePath.base),
            'utf8',
            (err, data) => {
              if (err) throw err;

              fs.appendFile(bundlePath, data + '\n', (err) => {
                if (err) throw err;
              });
            },
          );
        }
      });
    },
  );
});
