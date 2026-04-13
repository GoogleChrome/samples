/// <reference types="node" />
import { Context } from '../context';
import { Template } from '../template';
import { Emitter } from '../emitters';
export declare class Render {
    renderTemplatesToNodeStream(templates: Template[], ctx: Context): NodeJS.ReadableStream;
    renderTemplates(templates: Template[], ctx: Context, emitter?: Emitter): IterableIterator<any>;
}
