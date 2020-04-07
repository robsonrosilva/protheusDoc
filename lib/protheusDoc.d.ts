import { ProjectProtheusDoc } from './models/project-protheus-doc';
import { FileProtheusDoc } from './models/file-protheus-doc';
export declare class ProtheusDocHTML {
    regex: RegExp;
    regexItem: RegExp;
    regexEnd: RegExp;
    ProjectInspect(pathsProject: string[], outPath: string, templatesPath?: string): Promise<ProjectProtheusDoc>;
    private addPath;
    FileInspect(fileContent: string, fileName: string): Promise<FileProtheusDoc>;
}
