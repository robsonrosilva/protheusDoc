analise-advpl

Criação de modulo para validação de fontes ADVPL.

## Install

```sh
npm install analise-advpl --save
```

## Test

```sh
npm run test
```

## Example usage in global scope

```js
const fileSystem = require('file-system');
let validaAdvpl = require('analise-advpl');
let conteudo = fileSystem.readFileSync('c:\\arquivo.prw', 'latin1');

//o primeiro parâmetro é o padrão de comentários e o segundo a localização de mensagens
let objeto = new validaAdvpl.ValidaAdvpl([], 'ptb');
//define o nome do banco de dados ou owner
objeto.ownerDb = ['PROTHEUS'];
//define os códigos de empresas que irá validar na queryes
objeto.empresas = ['01'];
//efetua a validação do fonte
objeto.validacao(conteudo, 'COM ERRO');
```

```js
let validaProjeto = require('../lib/validaProjeto');
let objeto = new validaProjeto.validaProjeto([]);

let comentario = [
  '/*//#########################################################################################',
  'Projeto\\ \\:',
  'Modulo\\ \\ \\:',
  'Fonte\\ \\ \\ \\:',
  'Objetivo\\:'
];

//seta variáveis
objeto.ownerDb = ['PROTHEUS'];
objeto.empresas = ['01'];
objeto.comentFontPad = comentario;

objeto.validaProjeto([
  'D:\\rogerio\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\protheus'
]);
```
