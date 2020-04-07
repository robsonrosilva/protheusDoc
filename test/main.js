let protheusDoc = require('../lib/protheusDoc');
const fileSystem = require('fs');
let objeto = new protheusDoc.ProtheusDoc();

fileSystem.mkdir('./test/out/', { recursive: true }, (err) => {
  if (err) throw err;
});

objeto
  .ProjectInspect(['D:/Dropbox/Trabalho/WORKSPACE/POUPEX/ADVPL/protheus'])
  .then((project) => {
    fileSystem.writeFile(
      './test/out/data.json',
      JSON.stringify(project),
      { flag: 'w' },
      function (err) {
        if (err) return console.log(err);
      }
    );
  })
  .catch((e) => {
    console.log(e);
  });
