const protheusDoc = require('../lib/protheusDoc');
const objeto = new protheusDoc.ProtheusDocHTML();

objeto
  .FilesInspect(
    [
      'D:/Workspace/NODE/protheusDoc/test/erro.prw',
    ],
    './test/out/unique file',
  )
  .catch((e) => {
    console.log(e);
  });
