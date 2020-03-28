const fileSystem = require('fs');
import * as globby from 'globby';
var path = require('path');

export class ProjectProtheusDoc {
  projectName: string = '';
  htmlTree: string = '';
  html: string = '';
  files: FileProtheusDoc[] = [];
}

export class FileProtheusDoc {
  fileName: string = '';
  html: string = '';
  functionList: ItemProtheusDoc[] = [];
}

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
  indexHtml: string = fileSystem.readFileSync(
    path.join(__dirname, 'html', 'index.html'),
    'utf8'
  );

  public ProjectHtml(pathsProject: string[]): Promise<ProjectProtheusDoc> {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        let objeto: ProjectProtheusDoc = new ProjectProtheusDoc();
        this.ProjectInspect(pathsProject).then(project => {
          objeto.files = project.files;

          let tree = {};
          for (var x = 0; x < project.files.length; x++) {
            for (var i = 0; i < pathsProject.length; i++) {
              project.files[x].fileName = project.files[x].fileName.replace(
                pathsProject[i],
                ''
              );
            }

            const paths: string[] = ('raiz' + project.files[x].fileName).split(
              /\/|\\/
            );
            this.addPath(tree, paths);
          }
          objeto.htmlTree = this.treeHtml(tree);
          objeto.html = this.indexHtml.replace('%htmlTree%', objeto.htmlTree);
          resolve(objeto);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // cria atributo com o nome da pasta ou se for o último nível adiciona como arquivo
  private addPath(object: any, pathList: string[]) {
    // se for o último é arquivo
    if (pathList.length == 1) {
      object['fi\\les'].push(pathList[0]);
    } else {
      let path = pathList.shift();
      // se não existe
      if (!object[path]) {
        object[path] = { 'fi\\les': [] };
      }
      this.addPath(object[path], pathList);
    }
  }

  // cria atributo com o nome da pasta ou se for o último nível adiciona como arquivo
  private treeHtml(object: any): string {
    let html: string = '';
    let props: string[] = [];
    for (let i in object) {
      if (object.hasOwnProperty(i)) {
        props.push(i);
      }
    }
    props.sort();

    for (let i in props) {
      if (Array.isArray(object[props[i]])) {
        for (var x = 0; x < object[props[i]].length; x++) {
          html +=
            '<li><a href="#" onclick="return loadIframe(\'files/' +
            object[props[i]][x] +
            '.html\')">' +
            object[props[i]][x] +
            '</a></li>';
        }
      } else {
        html += '<li><label class="tree-toggler nav-header">' + props[i];
        html += '</label><ul class="nav nav-list tree"';
        // raiz fica visível sempre
        html += i === 'raiz' ? '>' : 'style="display: none;">';
        html += this.treeHtml(object[props[i]]);
        html += '</ul></li>';
      }
    }

    return html;
  }

  public ProjectInspect(pathsProject: string[]): Promise<ProjectProtheusDoc> {
    return new Promise((resolve: Function, reject: Function) => {
      let project = new ProjectProtheusDoc();
      let advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
      let promisses: Promise<FileProtheusDoc>[] = [];

      // monta expressão para buscar arquivos
      let globexp: any[] = [];
      for (var i = 0; i < advplExtensions.length; i++) {
        globexp.push(`**/*.${advplExtensions[i]}`);
      }

      let promissesGlobby = [];
      for (var i = 0; i < pathsProject.length; i++) {
        let pathProject: string = pathsProject[i];
        promissesGlobby.push(
          globby.default(globexp, {
            cwd: pathProject,
            caseSensitiveMatch: false
          })
        );
      }

      Promise.all(promissesGlobby)
        .then((folder: any[]) => {
          for (var x = 0; x < folder.length; x++) {
            let files = folder[x];
            for (var j = 0; j < files.length; j++) {
              let fileName: string = files[j];

              let conteudo = fileSystem.readFileSync(
                pathsProject + '\\' + fileName,
                'latin1'
              );

              promisses.push(
                this.FileHtml(conteudo, pathsProject + '\\' + fileName)
              );
            }
          }

          Promise.all(promisses)
            .then((files: FileProtheusDoc[]) => {
              project.files = files;
              resolve(project);
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e);
        });
    });
  }

  public FileHtml(
    fileContent: string,
    fileName: string = ''
  ): Promise<FileProtheusDoc> {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        let file: FileProtheusDoc = new FileProtheusDoc();
        file.fileName = fileName;
        this.FileInspect(fileContent).then(
          (fileInspected: ItemProtheusDoc[]) => {
            file.functionList = fileInspected;

            let html = this.fileHtml;
            let content = '';
            let fixedProperties: string[] = [
              'functionName',
              'description',
              'author',
              'since',
              'version',
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
              functionHtml = functionHtml.replace(
                '%version%',
                fileInspected[key].version
              );

              let sintaxe = fileInspected[key].functionName + '(';
              let param = '';
              for (let i = 0; i < fileInspected[key].param.length; i++) {
                sintaxe += fileInspected[key].param[i].name;
                sintaxe += i == fileInspected[key].param.length - 1 ? '' : ',';

                param +=
                  '<tr><td>' + fileInspected[key].param[i].name + '</td>';
                param += '<td>' + fileInspected[key].param[i].type + '</td>';
                param +=
                  '<td>' + fileInspected[key].param[i].obrigatory + '</td>';
                param +=
                  '<td>' +
                  fileInspected[key].param[i].description +
                  '</td></tr>';
              }
              sintaxe += ')';

              functionHtml = functionHtml.replace('%sintaxe%', sintaxe);
              functionHtml = functionHtml.replace('%param%', param);

              let returnHtml = '';
              for (let i = 0; i < fileInspected[key].return.length; i++) {
                returnHtml +=
                  '<tr><td>' + fileInspected[key].return[i].type + '</td>';
                returnHtml +=
                  '<td>' +
                  fileInspected[key].return[i].description +
                  '</td></tr>';
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
                    otherInfo +=
                      '<td>' + fileInspected[key][prop] + '</td></tr>';
                  }
                }
              }
              functionHtml = functionHtml.replace('%otherInfo%', otherInfo);

              content += functionHtml + '\n';
            }
            html = html.replace('%content%', content);
            file.html = html;
            resolve(file);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  public FileInspect(fileContent: string): Promise<ItemProtheusDoc[]> {
    return new Promise((resolve: Function) => {
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
                param.description = splitContent[2]
                  ? splitContent[2].trim()
                  : '';
                itemDoc.param.push(param);
              } else if (property === 'history') {
                let history = new prothesuDocHistory();
                let splitContent = content.split(',');
                history.date = splitContent[0] ? splitContent[0].trim() : '';
                history.username = splitContent[1]
                  ? splitContent[1].trim()
                  : '';
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
      resolve(listDocumentation);
    });
  }
}
