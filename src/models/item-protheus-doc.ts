import { prothesuDocHistory } from './protheus-doc-history';
import { prothesuDocParam } from './protheus-doc-parm';
import { prothesuDocReturn } from './protheus-doc-return';

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
