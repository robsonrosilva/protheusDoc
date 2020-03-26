let protheusDoc = require('../lib/protheusDoc');
const fileSystem = require('fs');
let directoryPath = __dirname + '\\files';
let objeto = new protheusDoc.ProtheusDoc();

let conteudo = fileSystem.readFileSync(
  'C:\\Users\\robso\\eclipse-workspace\\TEMP\\tmp\\CNTA121.PRW',
  'latin1'
);

objeto
  .FileHtml(conteudo)
  .then(html => {
    console.log(html);
  })
  .catch(e => {
    console.log(e);
  });
