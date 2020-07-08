"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend = void 0;
const Class = require("@singleware/class");
const helper_1 = require("./helper");
/**
 * Backend client class.
 */
let Backend = class Backend extends Class.Null {
    /**
     * Get all response headers as native headers map.
     * @param headers Non-native headers object.
     * @returns Returns the native headers map.
     */
    static getResponseHeaders(headers) {
        const data = {};
        for (const name in headers) {
            data[name.toLowerCase()] = headers[name];
        }
        return data;
    }
    /**
     * Gets the request options entity.
     * @param input Request input.
     * @param url Request URL.
     * @returns Return the request options entity.
     */
    static getRequestOptions(input, url) {
        const options = {
            method: input.method,
            headers: this.getResponseHeaders(input.headers),
            protocol: url.protocol,
            port: url.port,
            host: url.hostname,
            path: url.pathname
        };
        return options;
    }
    /**
     * Gets the response output entity.
     * @param input Request input.
     * @param payload Response payload.
     * @param response Response object.
     * @returns Returns the response output entity.
     */
    static getResponseOutput(input, payload, response) {
        var _a, _b;
        const output = {
            input: input,
            headers: response.headers,
            status: {
                code: (_a = response.statusCode) !== null && _a !== void 0 ? _a : 0,
                message: (_b = response.statusMessage) !== null && _b !== void 0 ? _b : 'Undefined status'
            }
        };
        if (payload.length > 0) {
            if (helper_1.Helper.isAcceptedContentType(output.headers['content-type'], 'application/json')) {
                output.payload = JSON.parse(payload.toString('utf-8'));
            }
            else {
                output.payload = payload;
            }
        }
        return output;
    }
    /**
     * Response, event handler.
     * @param input Input request.
     * @param resolve Promise resolve callback.
     * @param reject Promise reject callback.
     * @param response Request response.
     */
    static responseHandler(input, resolve, reject, response) {
        let chunks = [];
        response.on('data', chunk => chunks.push(new Uint8Array(chunk)));
        response.on('error', error => reject(error));
        response.on('end', () => resolve(this.getResponseOutput(input, Buffer.concat(chunks), response)));
    }
    /**
     * Request a new response from the API using a backend HTTP/HTTPS client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static async request(input) {
        const url = new URL(input.url);
        const client = require(url.protocol.substr(0, url.protocol.length - 1));
        let payload;
        if (input.payload) {
            payload = JSON.stringify(input.payload);
            input.headers['Content-Length'] = Buffer.byteLength(payload).toString();
            input.headers['Content-Type'] = 'application/json';
        }
        return new Promise((resolve, reject) => {
            const options = this.getRequestOptions(input, url);
            const request = client.request(options, this.responseHandler.bind(this, input, resolve, reject));
            if (payload) {
                request.write(payload);
            }
            request.end();
        });
    }
};
__decorate([
    Class.Private()
], Backend, "getResponseHeaders", null);
__decorate([
    Class.Private()
], Backend, "getRequestOptions", null);
__decorate([
    Class.Private()
], Backend, "getResponseOutput", null);
__decorate([
    Class.Private()
], Backend, "responseHandler", null);
__decorate([
    Class.Public()
], Backend, "request", null);
Backend = __decorate([
    Class.Describe()
], Backend);
exports.Backend = Backend;
//# sourceMappingURL=backend.js.map