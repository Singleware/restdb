"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Class = require("@singleware/class");
/**
 * Backend client class.
 */
let Backend = class Backend extends Class.Null {
    /**
     * Request a new response from the API using a backend HTTP client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static async request(input) {
        const url = new URL(input.url);
        const client = require(url.protocol);
        let data;
        if (input.content) {
            data = JSON.stringify(input.content);
            input.headers['Content-Length'] = data.length.toString();
        }
        return new Promise((resolve, reject) => {
            const options = {
                method: input.method,
                headers: input.headers,
                protocol: url.protocol,
                port: url.port,
                host: url.hostname,
                path: url.pathname
            };
            const request = client.request(options, (response) => {
                let body = '';
                response
                    .setEncoding('utf8')
                    .on('data', (data) => {
                    body += data;
                })
                    .on('error', (error) => {
                    reject(error);
                })
                    .on('end', () => {
                    resolve({
                        input: input,
                        status: {
                            code: response.statusCode || 0,
                            message: response.statusMessage || ''
                        },
                        headers: response.headers,
                        body: body.length > 0 ? JSON.parse(body) : void 0
                    });
                });
            });
            if (data) {
                request.write(data);
                request.end();
            }
        });
    }
};
__decorate([
    Class.Public()
], Backend, "request", null);
Backend = __decorate([
    Class.Describe()
], Backend);
exports.Backend = Backend;
//# sourceMappingURL=backend.js.map