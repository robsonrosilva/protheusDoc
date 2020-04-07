"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectProtheusDoc {
    constructor() {
        this.projectName = '';
        this.tree = new TreeItems('');
        this.files = [];
    }
}
exports.ProjectProtheusDoc = ProjectProtheusDoc;
class TreeItems {
    constructor(name) {
        this.name = name;
        this.files = [];
        this.paths = [];
    }
}
exports.TreeItems = TreeItems;
class FileTree {
    constructor(file, uniqueName) {
        this.file = file;
        this.uniqueName = uniqueName;
    }
}
exports.FileTree = FileTree;
//# sourceMappingURL=project-protheus-doc.js.map