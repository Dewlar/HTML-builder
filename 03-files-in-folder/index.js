const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Read error: ', err.message);
  else
    files.forEach((file) => {
      if (file.isFile()) {
        let parseFile = path.parse(file.name);
        fs.stat(path.join(folderPath, file.name), (err, stat) => {
          if (err) console.log('Get stat error: ', err.message);

          console.log(
            parseFile.name,
            ' - ',
            parseFile.ext.slice(1),
            ' - ',
            stat.size,
          );
        });
      }
    });
});
