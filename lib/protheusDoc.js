"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileSystem = require('fs');
const path = require('path');
const globby = __importStar(require("globby"));
const project_protheus_doc_1 = require("./models/project-protheus-doc");
const file_protheus_doc_1 = require("./models/file-protheus-doc");
const item_protheus_doc_1 = require("./models/item-protheus-doc");
const protheus_doc_return_1 = require("./models/protheus-doc-return");
const protheus_doc_parm_1 = require("./models/protheus-doc-parm");
const protheus_doc_history_1 = require("./models/protheus-doc-history");
class ProtheusDocHTML {
    constructor() {
        this.regex = /^(\s*\/\*\/(.*)?\{Protheus.doc\}\s*)(.*)?/i;
        this.regexItem = /^(\s?@)([A-Za-z0-9]+)+(\s)+(.*)?/i;
        this.regexEnd = /(\*\/)/i;
    }
    ProjectInspect(pathsProject, outPath, templatesPath) {
        return new Promise((resolve, reject) => {
            let project = new project_protheus_doc_1.ProjectProtheusDoc();
            let advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
            let promisses = [];
            // monta expressão para buscar arquivos
            let globexp = [];
            for (var i = 0; i < advplExtensions.length; i++) {
                globexp.push(`**/*.${advplExtensions[i]}`);
            }
            let promissesGlobby = [];
            for (var i = 0; i < pathsProject.length; i++) {
                let pathProject = pathsProject[i];
                promissesGlobby.push(globby.default(globexp, {
                    cwd: pathProject,
                    caseSensitiveMatch: false,
                }));
            }
            Promise.all(promissesGlobby)
                .then((folder) => {
                for (var x = 0; x < folder.length; x++) {
                    let files = folder[x];
                    for (var j = 0; j < files.length; j++) {
                        let fileName = files[j];
                        let conteudo = fileSystem.readFileSync(pathsProject + '/' + fileName, 'latin1');
                        promisses.push(this.FileInspect(conteudo, pathsProject + '/' + fileName));
                    }
                }
                Promise.all(promisses)
                    .then((files) => {
                    project.files = files;
                    project.tree = new project_protheus_doc_1.TreeItems('raiz');
                    for (var x = 0; x < project.files.length; x++) {
                        for (var i = 0; i < pathsProject.length; i++) {
                            project.files[x].fileName = project.files[x].fileName.replace(pathsProject[i], '');
                        }
                        let paths = project.files[x].fileName.split(/\/|\\/);
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
                            if (err)
                                throw err;
                        });
                        let filelist = ['index', 'file'];
                        let fileExtensions = ['css', 'html', 'js'];
                        filelist.forEach((file) => {
                            let contentFile = '';
                            fileExtensions.forEach((extension) => {
                                contentFile = fileSystem.readFileSync(path.join(templatesPath, file + '.' + extension), 'utf8');
                                fileSystem.writeFile(path.join(outPath, file + '.' + extension), contentFile, { flag: 'w' }, function (err) {
                                    if (err)
                                        return console.log(err);
                                });
                            });
                        });
                        fileSystem.writeFile(path.join(outPath, 'data.js'), `
				  let dataProject = ${JSON.stringify(project)}
				  `, { flag: 'w' }, function (err) {
                            if (err)
                                return console.log(err);
                        });
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
    addPath(object, pathList, file) {
        // se for o último é arquivo
        if (pathList.length == 1) {
            object.files.push(new project_protheus_doc_1.FileTree(pathList[0], file));
        }
        else {
            let path = pathList.shift();
            // se não existe
            let pathFind = object.paths.find((pathItem) => {
                return pathItem.name === path;
            });
            if (!pathFind) {
                pathFind = new project_protheus_doc_1.TreeItems(path);
                object.paths.push(pathFind);
            }
            this.addPath(pathFind, pathList, file);
        }
    }
    FileInspect(fileContent, fileName) {
        return new Promise((resolve) => {
            let file = new file_protheus_doc_1.FileProtheusDoc();
            file.fileName = fileName;
            file.functionList = [];
            let lines = fileContent.split('\n');
            //Percorre todas as linhas
            for (let key = 0; key < lines.length; key++) {
                if (lines[key].match(this.regex)) {
                    let itemDoc = new item_protheus_doc_1.ItemProtheusDoc();
                    itemDoc.functionName = lines[key]
                        .replace(this.regex, '$3')
                        .replace(/([A-Za-z0-9]+)+(.*)/, '$1')
                        .trim();
                    key++;
                    let inDescription = true;
                    while (!lines[key].match(this.regexEnd) && key < lines.length) {
                        if (lines[key].match(this.regexItem)) {
                            inDescription = false;
                            let property = lines[key]
                                .replace(this.regexItem, '$2')
                                .toLowerCase()
                                .trim();
                            let content = lines[key].replace(this.regexItem, '$4');
                            if (property === 'return') {
                                let returnPar = new protheus_doc_return_1.ProthesuDocReturn();
                                let splitContent = content.split(',');
                                returnPar.type = splitContent[0] ? splitContent[0].trim() : '';
                                returnPar.description = splitContent[1]
                                    ? splitContent[1].trim()
                                    : '';
                                itemDoc.return.push(returnPar);
                            }
                            else if (property === 'param') {
                                let param = new protheus_doc_parm_1.ProthesuDocParam();
                                let splitContent = content.split(',');
                                param.name = splitContent[0] ? splitContent[0].trim() : '';
                                param.type = splitContent[1] ? splitContent[1].trim() : '';
                                param.description = splitContent[2]
                                    ? splitContent[2].trim()
                                    : '';
                                itemDoc.param.push(param);
                            }
                            else if (property === 'history') {
                                let history = new protheus_doc_history_1.ProthesuDocHistory();
                                let splitContent = content.split(',');
                                history.date = splitContent[0] ? splitContent[0].trim() : '';
                                history.username = splitContent[1]
                                    ? splitContent[1].trim()
                                    : '';
                                history.description = splitContent[2]
                                    ? splitContent[2].trim()
                                    : '';
                                itemDoc.history.push(history);
                            }
                            else if (property === 'link' || property === 'example') {
                                itemDoc[property].push(content);
                            }
                            else if (Object.keys(itemDoc).includes(property)) {
                                itemDoc[property] = content;
                            }
                        }
                        else if (inDescription && lines[key].trim()) {
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
exports.ProtheusDocHTML = ProtheusDocHTML;
//# sourceMappingURL=protheusDoc.js.map