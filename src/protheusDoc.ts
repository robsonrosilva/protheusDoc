const fileSystem = require('fs');
const path = require('path');
import * as globby from 'globby';
import {
  ProjectProtheusDoc,
  TreeItems,
  FileTree,
} from './models/project-protheus-doc';
import { FileProtheusDoc } from './models/file-protheus-doc';
import { ItemProtheusDoc } from './models/item-protheus-doc';
import { ProthesuDocReturn } from './models/protheus-doc-return';
import { ProthesuDocParam } from './models/protheus-doc-parm';
import { ProthesuDocHistory } from './models/protheus-doc-history';

export class ProtheusDocHTML {
  regex: RegExp = /^(\s*\/\*\/(.*)?\{Protheus.doc\}\s*)(.*)?/i;
  regexItem: RegExp = /^(\s*@)([A-Za-z0-9]+)+(\s)+(.*)?/i;
  regexEnd: RegExp = /(\*\/)/i;

  public ProjectInspect(
    pathsProject: string[],
    outPath: string,
    templatesPath?: string
  ): Promise<ProjectProtheusDoc> {
    return new Promise((resolve: Function, reject: Function) => {
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
              this.InternalFilesInspect(
                files,
                resolve,
                outPath,
                pathsProject,
                templatesPath
              );
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

  public FilesInspect(
    files: string[],
    outPath: string,
    templatesPath?: string
  ): Promise<ProjectProtheusDoc> {
    return new Promise((resolve: Function, reject: Function) => {
      let promisses: Promise<FileProtheusDoc>[] = [];
      for (var j = 0; j < files.length; j++) {
        let fileName: string = files[j];

        let conteudo = fileSystem.readFileSync(fileName, 'latin1');

        promisses.push(this.FileInspect(conteudo, fileName));
      }
      Promise.all(promisses)
        .then((files: FileProtheusDoc[]) => {
          this.InternalFilesInspect(
            files,
            resolve,
            outPath,
            [''],
            templatesPath
          );
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  public InternalFilesInspect(
    files: FileProtheusDoc[],
    resolve: Function,
    outPath: string,
    pathsProject: string[],
    templatesPath?: string
  ) {
    let project = new ProjectProtheusDoc();
    project.files = files;
    project.tree = new TreeItems('raiz');
    for (var x = 0; x < project.files.length; x++) {
      for (var i = 0; i < pathsProject.length; i++) {
        if (pathsProject[i]) {
          project.files[x].fileName = project.files[x].fileName.replace(
            pathsProject[i],
            ''
          );
        } else {
          let aSplitName = project.files[x].fileName.split(/\/|\\/);
          project.files[x].fileName = aSplitName[aSplitName.length - 1];
        }
      }

      let paths: string[] = project.files[x].fileName.split(/\/|\\/);
      //remove itens vazios
      paths = paths.filter((x) => x);
      this.addPath(project.tree, paths, project.files[x].fileName);
    }
    if (outPath) {
      // se não tem templates usa os arquivos da sample
      if (!templatesPath) {
        templatesPath = path.join(__dirname, 'sample');
      }

      fileSystem.mkdir(outPath, { recursive: true }, (err) => {
        if (err) throw err;
      });

      let filelist = ['index', 'file'];
      let fileExtensions = ['css', 'html', 'js'];

      filelist.forEach((file) => {
        let contentFile = '';
        fileExtensions.forEach((extension) => {
          contentFile = fileSystem.readFileSync(
            path.join(templatesPath, file + '.' + extension),
            'utf8'
          );

          fileSystem.writeFile(
            path.join(outPath, file + '.' + extension),
            contentFile,
            { flag: 'w' },
            function (err) {
              if (err) return console.log(err);
            }
          );
        });
      });

      fileSystem.writeFile(
        path.join(outPath, 'data.js'),
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
            .replace(/([A-Za-z0-9:]+)+(.*)/, '$1')
            .trim();
          key++;
          let currentAttribute = 'description';
          while (!lines[key].match(this.regexEnd) && key < lines.length) {
            if (lines[key].match(this.regexItem)) {
              let property: string = lines[key]
                .replace(this.regexItem, '$2')
                .toLowerCase()
                .trim();
              currentAttribute = property;
              let content: string = lines[key].replace(this.regexItem, '$4');
              if (property === 'return') {
                let returnPar = new ProthesuDocReturn();
                let splitContent = content.split(',');
                returnPar.type = splitContent[0] ? splitContent[0].trim() : '';
                returnPar.description = splitContent[1]
                  ? content.replace(splitContent[0] + ',', '').trim()
                  : '';
                itemDoc.return.push(returnPar);
              } else if (property === 'param') {
                let param = new ProthesuDocParam();
                let splitContent = content.split(',');
                param.name = splitContent[0]
                  ? splitContent[0].trim().replace(/\[|\]/g, '')
                  : '';
                param.type = splitContent[1] ? splitContent[1].trim() : '';
                param.description = splitContent[2]
                  ? content
                      .replace(
                        splitContent[0] + ',' + splitContent[1] + ',',
                        ''
                      )
                      .trim()
                  : '';
                param.obrigatory = !splitContent[0].includes('[');
                itemDoc.param.push(param);
              } else if (property === 'history') {
                let history = new ProthesuDocHistory();
                let splitContent = content.split(',');
                history.date = splitContent[0] ? splitContent[0].trim() : '';
                history.username = splitContent[1]
                  ? splitContent[1].trim()
                  : '';
                history.description = splitContent[2]
                  ? content
                      .replace(
                        splitContent[0] + ',' + splitContent[1] + ',',
                        ''
                      )
                      .trim()
                  : '';
                itemDoc.history.push(history);
              } else if (
                Object.prototype.toString.call(itemDoc[property]) ===
                '[object Array]'
              ) {
                itemDoc[property].push(content);
              } else if (Object.keys(itemDoc).includes(property)) {
                itemDoc[property] = content;
              }
            } else if (
              currentAttribute &&
              lines[key].trim() &&
              typeof itemDoc[currentAttribute] === 'string'
            ) {
              itemDoc[currentAttribute] +=
                (itemDoc[currentAttribute] ? '<br>' : '') + lines[key];
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
