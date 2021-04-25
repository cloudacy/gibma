"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const https_1 = require("https");
const content_type_1 = require("content-type");
async function request(url, options) {
    return new Promise((resolve, reject) => {
        const req = https_1.request(url, options || {});
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
        if (options?.data) {
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
