const fileSystem = require('fs');
var path = require('path');

export class ItemProtheusDoc {
  functionName: string = undefined;
  accessLevel: string = undefined;
  author: string = undefined;
  build: string = undefined;
  country: string = undefined;
  database: string = undefined;
  defvalue: string = undefined;
  description: string = '';
  deprecated: string = undefined;
  example: string[] = [];
  history: prothesuDocHistory[] = [];
  sample: string = undefined;
  language: string = undefined;
  link: string[] = [];
  obs: string = undefined;
  param: prothesuDocParam[] = [];
  proptype: string = undefined;
  protected: string = undefined;
  readonly: string = undefined;
  return: prothesuDocReturn[] = [];
  source: string = undefined;
  systemOper: string = undefined;
  see: string = undefined;
  since: string = undefined;
  table: string = undefined;
  todo: string = undefined;
  type: string = undefined;
  version: string = undefined;
}

export class prothesuDocParam {
  name: string;
  type: string;
  description: string;
  obrigatory: string;
}

export class prothesuDocReturn {
  type: string;
  description: string;
}

export class prothesuDocHistory {
  date: string;
  username: string;
  description: string;
}

export class ProtheusDoc {
  regex: RegExp = /^(\s*\/\*\/(.*)?\{Protheus.doc\}\s*)(.*)?/i;
  regexItem: RegExp = /^(\s?@)([A-Za-z0-9]+)+(\s)+(.*)?/i;
  regexEnd: RegExp = /(\*\/)/i;
  fileHtml: string = fileSystem.readFileSync(
    path.join(__dirname, 'html', 'file.html'),
    'utf8'
  );
  FunctionHtml: string = fileSystem.readFileSync(
    path.join(__dirname, 'html', 'function.html'),
    'utf8'
  );

  public ProjectHtml(path: string): Promise<ProtheusDoc> {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        let objeto: ProtheusDoc = this;
        resolve(objeto);
      } catch (e) {
        reject(e);
      }
    });
  }

  public FileHtml(fileContent: string, fileName: string = ''): Promise<string> {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        let fileInspected: ItemProtheusDoc[] = this.FileInspect(fileContent);
        let html = this.fileHtml;
        let content = '';
        let fixedProperties: string[] = [
          'functionName',
          'description',
          'author',
          'since',
          'param',
          'return',
          'example',
          'link'
        ];
        html = html.replace('%fileName%', fileName);
        // html = html.replace('%fileDescription%', fileDescription);
        // Montar o Html baseado na Análise
        for (let key = 0; key < fileInspected.length; key++) {
          let functionHtml: string = this.FunctionHtml;
          functionHtml = functionHtml.replace(
            /\%functionName\%/g,
            fileInspected[key].functionName
          );
          functionHtml = functionHtml.replace(
            '%description%',
            fileInspected[key].description
          );
          functionHtml = functionHtml.replace(
            '%author%',
            fileInspected[key].author
          );
          functionHtml = functionHtml.replace(
            '%since%',
            fileInspected[key].since
          );

          let sintaxe = fileInspected[key].functionName + '(';
          let param = '';
          for (let i = 0; i < fileInspected[key].param.length; i++) {
            sintaxe += fileInspected[key].param[i].name;
            sintaxe += i == fileInspected[key].param.length - 1 ? '' : ',';

            param += '<tr><td>' + fileInspected[key].param[i].name + '</td>';
            param += '<td>' + fileInspected[key].param[i].type + '</td>';
            param += '<td>' + fileInspected[key].param[i].obrigatory + '</td>';
            param +=
              '<td>' + fileInspected[key].param[i].description + '</td></tr>';
          }
          sintaxe += ')';

          functionHtml = functionHtml.replace('%sintaxe%', sintaxe);
          functionHtml = functionHtml.replace('%param%', param);

          let returnHtml = '';
          for (let i = 0; i < fileInspected[key].return.length; i++) {
            returnHtml +=
              '<tr><td>' + fileInspected[key].return[i].type + '</td>';
            returnHtml +=
              '<td>' + fileInspected[key].return[i].description + '</td></tr>';
          }
          functionHtml = functionHtml.replace('%return%', returnHtml);

          let example = '';
          for (let i = 0; i < fileInspected[key].example.length; i++) {
            example += '<code>' + fileInspected[key].example[i] + '</code>';
          }
          functionHtml = functionHtml.replace('%example%', example);

          let link = '';
          for (let i = 0; i < fileInspected[key].link.length; i++) {
            link +=
              '<a href="' +
              fileInspected[key].link[i] +
              '" target="_blank">' +
              fileInspected[key].link[i] +
              '</a>';
          }
          functionHtml = functionHtml.replace('%link%', link);

          let otherInfo = '';
          for (var prop in fileInspected[key]) {
            if (
              Object.keys(fileInspected[key]).includes(prop) &&
              !fixedProperties.includes(prop) &&
              typeof fileInspected[key][prop] === 'string'
            ) {
              if (fileInspected[key][prop]) {
                otherInfo += '<tr><td>' + prop + '</td>';
                otherInfo += '<td>' + fileInspected[key][prop] + '</td></tr>';
              }
            }
          }
          functionHtml = functionHtml.replace('%otherInfo%', otherInfo);

          content += functionHtml + '\n';
        }
        html = html.replace('%content%', content);
        resolve(html);
      } catch (e) {
        reject(e);
      }
    });
  }

  public FileInspect(fileContent: string): ItemProtheusDoc[] {
    let listDocumentation: ItemProtheusDoc[] = [];
    let lines: String[] = fileContent.split('\n');
    //Percorre todas as linhas
    for (let key = 0; key < lines.length; key++) {
      if (lines[key].match(this.regex)) {
        let itemDoc: ItemProtheusDoc = new ItemProtheusDoc();
        itemDoc.functionName = lines[key]
          .replace(this.regex, '$3')
          .replace(/([A-Za-z0-9]+)+(.*)/, '$1')
          .trim();
        key++;
        let inDescription = true;
        while (!lines[key].match(this.regexEnd) && key < lines.length) {
          if (lines[key].match(this.regexItem)) {
            inDescription = false;
            let property: string = lines[key]
              .replace(this.regexItem, '$2')
              .toLowerCase()
              .trim();
            let content: string = lines[key].replace(this.regexItem, '$4');
            if (property === 'return') {
              let returnPar = new prothesuDocReturn();
              let splitContent = content.split(',');
              returnPar.type = splitContent[0] ? splitContent[0].trim() : '';
              returnPar.description = splitContent[1]
                ? splitContent[1].trim()
                : '';
              itemDoc.return.push(returnPar);
            } else if (property === 'param') {
              let param = new prothesuDocParam();
              let splitContent = content.split(',');
              param.name = splitContent[0] ? splitContent[0].trim() : '';
              param.type = splitContent[1] ? splitContent[1].trim() : '';
              param.description = splitContent[2] ? splitContent[2].trim() : '';
              itemDoc.param.push(param);
            } else if (property === 'history') {
              let history = new prothesuDocHistory();
              let splitContent = content.split(',');
              history.date = splitContent[0] ? splitContent[0].trim() : '';
              history.username = splitContent[1] ? splitContent[1].trim() : '';
              history.description = splitContent[2]
                ? splitContent[2].trim()
                : '';
              itemDoc.history.push(history);
            } else if (property === 'link' || property === 'example') {
              itemDoc[property].push(content);
            } else if (Object.keys(itemDoc).includes(property)) {
              itemDoc[property] = content;
            }
          } else if (inDescription && lines[key].trim()) {
            itemDoc.description += lines[key] + '\n';
          }
          key++;
        }
        itemDoc.description = itemDoc.description.trim();
        listDocumentation.push(itemDoc);
      }
    }
    return listDocumentation;
  }
}
