import { FileProtheusDoc } from './file-protheus-doc';

export class ProjectProtheusDoc {
  projectName: string = '';
  tree: TreeItems = new TreeItems('');
  files: FileProtheusDoc[] = [];
}

export class TreeItems {
  name: string;
  files: FileTree[];
  paths: TreeItems[];

  constructor(name: string) {
    this.name = name;
    this.files = [];
    this.paths = [];
  }
}

export class FileTree {
  uniqueName: string;
  file: string;

  constructor(file: string, uniqueName: string) {
    this.file = file;
    this.uniqueName = uniqueName;
  }
}
