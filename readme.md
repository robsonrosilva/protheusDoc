protheusdoc

Extension for interprate ProtheusDoc and generate HTML.

## Install

```sh
npm install protheusdoc --save
```

## Test

```sh
npm run test
```

## Example usage in global scope

### Single File

```js
let protheusDoc = require('../lib/protheusDoc');
const fileSystem = require('fs');
let directoryPath = __dirname + '\\files';
let objeto = new protheusDoc.ProtheusDoc();

let conteudo = fileSystem.readFileSync(
  'C:\\Users\\robso\\eclipse-workspace\\TEMP\\tmp\\CNTA121.PRW',
  'latin1'
);

fileSystem.mkdir('./test/out/file/', { recursive: true }, err => {
  if (err) throw err;
});

objeto
  .FileHtml(conteudo)
  .then(file => {
    fileSystem.writeFile(
      './test/out/file/CNTA121.html',
      file.html,
      { flag: 'w' },
      function(err) {
        if (err) return console.log(err);
      }
    );
  })
  .catch(e => {
    console.log(e);
  });
```

### Multiple Files

```js
let protheusDoc = require('../lib/protheusDoc');
const fileSystem = require('fs');
let directoryPath = __dirname + '\\files';
let objeto = new protheusDoc.ProtheusDoc();

// cria estrutura de saída
fileSystem.mkdir('./test/out/project/files/', { recursive: true }, err => {
  if (err) throw err;
});

objeto
  .ProjectHtml(['D:\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\protheus\\'])
  .then(project => {
    fileSystem.writeFile(
      './test/out/project/index.html',
      project.html,
      { flag: 'w' },
      function(err) {
        if (err) return console.log(err);
      }
    );

    for (var x = 0; x < project.files.length; x++) {
      const names = project.files[x].fileName.split(/\/|\\/);
      fileSystem.writeFile(
        './test/out/project/files/' + names[names.length - 1] + '.html',
        project.files[x].html,
        { flag: 'w' },
        function(err) {
          if (err) return console.log(err);
        }
      );
    }
  })
  .catch(e => {
    console.log(e);
  });
```
