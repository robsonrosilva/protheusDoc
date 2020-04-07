import { FileProtheusDoc } from './file-protheus-doc';
import { triggerAsyncId } from 'async_hooks';

export class ProjectProtheusDoc {
  projectName: string = '';
  tree: TreeItems;
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

  constructor(file, uniqueName) {
    this.file = file;
    this.uniqueName = uniqueName;
  }
}
