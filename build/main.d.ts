/// <reference types="node" />
import { URL } from 'url';
import { IncomingMessage } from 'http';
import { RequestOptions } from 'https';
export declare function request(url: string | URL, options?: RequestOptions): Promise<IncomingMessage>;
