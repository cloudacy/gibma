"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const https_1 = require("https");
async function request(url, options) {
    return new Promise((resolve, reject) => {
        const req = https_1.request(url, options || {});
        req.on('response', (res) => {
            resolve(res);
        });
        req.on('error', (err) => {
            reject(err);
        });
        req.end();
    });
}
exports.request = request;
