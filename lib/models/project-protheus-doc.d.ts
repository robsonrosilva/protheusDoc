import { FileProtheusDoc } from './file-protheus-doc';
export declare class ProjectProtheusDoc {
    projectName: string;
    tree: TreeItems;
    files: FileProtheusDoc[];
}
export declare class TreeItems {
    name: string;
    files: FileTree[];
    paths: TreeItems[];
    constructor(name: string);
}
export declare class FileTree {
    uniqueName: string;
    file: string;
    constructor(file: string, uniqueName: string);
}
