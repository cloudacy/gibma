"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const url_1 = require("url");
const http_1 = require("http");
const https_1 = require("https");
const content_type_1 = require("content-type");
async function request(url, options) {
    // Always parse to a url object because nodejs will do it later instead
    if (!(url instanceof url_1.URL)) {
        url = new url_1.URL(url);
    }
    return new Promise((resolve, reject) => {
        options = options || {};
        options.headers = options.headers || {};
        // Support only 'User-Agent' (only with this case style) header
        // See https://developer.mozilla.org/de/docs/Web/HTTP/Headers/User-Agent
        if (!options.headers['User-Agent']) {
            options.headers['User-Agent'] = `NodeJS/${process.version}`;
        }
        const requestFn = url.protocol === 'http' ? http_1.request : https_1.request;
        const req = requestFn(url, options || {});
        req.on('response', (res) => {
            let chunk = '';
            res.on('data', (data) => {
                chunk += data;
            });
            res.on('end', () => {
                res.data = chunk;
                resolve(res);
            });
            res.json = () => {
                if (res.data === undefined) {
                    return null;
                }
                try {
                    const contentType = content_type_1.parse(res);
                    if (contentType.type === 'application/json') {
                        try {
                            return JSON.parse(res.data);
                        }
                        catch (e) {
                            throw new Error(`JSON could not be parsed (${e}). Original data: ${res.data}`);
                        }
                    }
                }
                catch (e) {
                    console.info(`Content type is missing in response. (${url})`, e);
                }
            };
        });
        req.on('error', (err) => {
            reject(err);
        });
        if (options === null || options === void 0 ? void 0 : options.data) {
            if (typeof options.data === 'object') {
                req.setHeader('content-type', 'application/json');
                req.write(JSON.stringify(options.data));
            }
            else {
                req.write(options.data);
            }
        }
        req.end();
    });
}
exports.request = request;
