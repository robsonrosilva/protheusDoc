import { ProthesuDocHistory } from './protheus-doc-history';
import { ProthesuDocParam } from './protheus-doc-parm';
import { ProthesuDocReturn } from './protheus-doc-return';

export class ItemProtheusDoc {
  functionName: string | undefined = undefined;
  accessLevel: string | undefined = undefined;
  author: string | undefined = undefined;
  build: string | undefined = undefined;
  country: string | undefined = undefined;
  database: string | undefined = undefined;
  defvalue: string | undefined = undefined;
  description: string = '';
  deprecated: string | undefined = undefined;
  example: string[] = [];
  history: ProthesuDocHistory[] = [];
  sample: string | undefined = undefined;
  language: string | undefined = undefined;
  link: string[] = [];
  obs: string | undefined = undefined;
  param: ProthesuDocParam[] = [];
  proptype: string | undefined = undefined;
  protected: string | undefined = undefined;
  readonly: string | undefined = undefined;
  return: ProthesuDocReturn[] = [];
  source: string | undefined = undefined;
  systemOper: string | undefined = undefined;
  see: string | undefined = undefined;
  since: string | undefined = undefined;
  table: string | undefined = undefined;
  todo: string | undefined = undefined;
  type: string | undefined = undefined;
  version: string | undefined = undefined;
}
