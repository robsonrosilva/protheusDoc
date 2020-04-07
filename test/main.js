let protheusDoc = require('../lib/protheusDoc');
let objeto = new protheusDoc.ProtheusDoc();

objeto
  .ProjectInspect(
    ['D:/Dropbox/Trabalho/WORKSPACE/POUPEX/ADVPL/protheus'],
    './test/out'
  )
  .catch((e) => {
    console.log(e);
  });
