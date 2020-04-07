let protheusDoc = require('../lib/protheusDoc');
const fileSystem = require('fs');
var path = require('path');
let objeto = new protheusDoc.ProtheusDoc();
let filelist = ['index', 'file'];
let fileExtensions = ['css', 'html', 'js'];

fileSystem.mkdir('./test/out/', { recursive: true }, (err) => {
  if (err) throw err;
});

filelist.forEach((file) => {
  let contentFile = '';
  fileExtensions.forEach((extension) => {
    contentFile = fileSystem.readFileSync(
      path.join(__dirname, '..', 'src', 'sample', file + '.' + extension),
      'utf8'
    );
    fileSystem.writeFile(
      './test/out/' + file + '.' + extension,
      contentFile,
      { flag: 'w' },
      function (err) {
        if (err) return console.log(err);
      }
    );
  });
});

objeto
  .ProjectInspect(
    ['D:/Dropbox/Trabalho/WORKSPACE/POUPEX/ADVPL/protheus'],
    './test/out/data.js'
  )
  .catch((e) => {
    console.log(e);
  });
