/// <reference types="node" />
import { URL } from 'url';
import { IncomingMessage } from 'http';
import { RequestOptions as HttpsRequestOptions } from 'https';
interface Response<Data> extends IncomingMessage {
    data?: string;
    json: () => Data | null;
}
export interface RequestOptions extends HttpsRequestOptions {
    /** Request data written to POST and PUT requests */
    data?: unknown;
}
export declare function request<Data = Record<string, unknown>>(url: string | URL, options?: RequestOptions): Promise<Response<Data>>;
export {};
