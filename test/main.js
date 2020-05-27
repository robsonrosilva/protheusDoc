let protheusDoc = require('../lib/protheusDoc');
let objeto = new protheusDoc.ProtheusDocHTML();

objeto
  .ProjectInspect(
    ['D:/Dropbox/Trabalho/WORKSPACE/POUPEX/ADVPL/protheus'],
    './test/out/project'
  )
  .catch((e) => {
    console.log(e);
  });

objeto
  .FilesInspect(
    [
      'D:/Dropbox/Trabalho/WORKSPACE/lord/ADVPL-LORD/LORD/Fiscal/Rotinas/ffisa001.prw',
    ],
    './test/out/unique file'
  )
  .catch((e) => {
    console.log(e);
  });
