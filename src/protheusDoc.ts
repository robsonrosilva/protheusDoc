const fileSystem = require('fs');
import * as globby from 'globby';
import {
  ProjectProtheusDoc,
  TreeItems,
  FileTree,
} from './models/project-protheus-doc';
import { FileProtheusDoc } from './models/file-protheus-doc';
import { ItemProtheusDoc } from './models/item-protheus-doc';
import { prothesuDocReturn } from './models/protheus-doc-return';
import { prothesuDocParam } from './models/protheus-doc-parm';
import { prothesuDocHistory } from './models/protheus-doc-history';

export class ProtheusDoc {
  regex: RegExp = /^(\s*\/\*\/(.*)?\{Protheus.doc\}\s*)(.*)?/i;
  regexItem: RegExp = /^(\s?@)([A-Za-z0-9]+)+(\s)+(.*)?/i;
  regexEnd: RegExp = /(\*\/)/i;

  public ProjectInspect(
    pathsProject: string[],
    outFile: string
  ): Promise<ProjectProtheusDoc> {
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
            caseSensitiveMatch: false,
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
                pathsProject + '/' + fileName,
                'latin1'
              );

              promisses.push(
                this.FileInspect(conteudo, pathsProject + '/' + fileName)
              );
            }
          }

          Promise.all(promisses)
            .then((files: FileProtheusDoc[]) => {
              project.files = files;
              project.tree = new TreeItems('raiz');
              for (var x = 0; x < project.files.length; x++) {
                for (var i = 0; i < pathsProject.length; i++) {
                  project.files[x].fileName = project.files[x].fileName.replace(
                    pathsProject[i],
                    ''
                  );
                }

                let paths: string[] = project.files[x].fileName.split(/\/|\\/);
                //remove itens vazios
                paths = paths.filter((x) => x);
                this.addPath(project.tree, paths, project.files[x].fileName);
              }
              if (outFile) {
                fileSystem.writeFile(
                  outFile,
                  `
				  let dataProject = ${JSON.stringify(project)}
				  `,
                  { flag: 'w' },
                  function (err) {
                    if (err) return console.log(err);
                  }
                );
              }

              resolve(project);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  // cria atributo com o nome da pasta ou se for o último nível adiciona como arquivo
  private addPath(object: TreeItems, pathList: string[], file: string) {
    // se for o último é arquivo
    if (pathList.length == 1) {
      object.files.push(new FileTree(pathList[0], file));
    } else {
      let path = pathList.shift();
      // se não existe
      let pathFind = object.paths.find((pathItem) => {
        return pathItem.name === path;
      });
      if (!pathFind) {
        pathFind = new TreeItems(path);
        object.paths.push(pathFind);
      }
      this.addPath(pathFind, pathList, file);
    }
  }

  public FileInspect(
    fileContent: string,
    fileName: string
  ): Promise<FileProtheusDoc> {
    return new Promise((resolve: Function) => {
      let file: FileProtheusDoc = new FileProtheusDoc();
      file.fileName = fileName;
      file.functionList = [];
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
          file.functionList.push(itemDoc);
        }
      }
      resolve(file);
    });
  }
}
