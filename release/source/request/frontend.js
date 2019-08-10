"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
/**
 * Frontend client class.
 */
let Frontend = class Frontend extends Class.Null {
    /**
     * Get all response headers as native headers map.
     * @param headers Non-native headers object.
     * @returns Returns the native headers map.
     */
    static getResponseHeaders(headers) {
        const data = {};
        for (const pair of headers.entries()) {
            const [name, value] = pair;
            const entry = name.toLowerCase();
            const current = data[entry];
            if (current === void 0) {
                data[entry] = value;
            }
            else if (current instanceof Array) {
                current.push(value);
            }
            else {
                data[entry] = [current];
            }
        }
        return data;
    }
    /**
     * Gets the response output entity.
     * @param input Request input.
     * @param payload Response payload.
     * @param response Response object.
     * @returns Returns the response output entity.
     */
    static getResponseOutput(input, payload, response) {
        const output = {
            input: input,
            headers: this.getResponseHeaders(response.headers),
            status: {
                code: response.status,
                message: response.statusText
            }
        };
        if (payload.length > 0) {
            if (output.headers['content-type'] === 'application/json') {
                output.payload = JSON.parse(payload);
            }
            else {
                output.payload = payload;
            }
        }
        return output;
    }
    /**
     * Request a new response from the API using a frontend HTTP/HTTPS client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static async request(input) {
        const options = {
            method: input.method,
            headers: new Headers(input.headers)
        };
        if (input.payload) {
            options.body = JSON.stringify(input.payload);
            options.headers.set('Content-Type', 'application/json');
        }
        const response = await fetch(input.url, options);
        const payload = await response.text();
        return this.getResponseOutput(input, payload, response);
    }
};
__decorate([
    Class.Private()
], Frontend, "getResponseHeaders", null);
__decorate([
    Class.Private()
], Frontend, "getResponseOutput", null);
__decorate([
    Class.Public()
], Frontend, "request", null);
Frontend = __decorate([
    Class.Describe()
], Frontend);
exports.Frontend = Frontend;
//# sourceMappingURL=frontend.js.map