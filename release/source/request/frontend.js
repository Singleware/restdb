"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
/**
 * Frontend client class.
 */
let Frontend = class Frontend extends Class.Null {
    /**
     * Get all the response headers as a native headers map.
     * @param headers Non-native headers object.
     * @returns Returns the native headers map.
     */
    static getHeaders(headers) {
        const data = {};
        const entries = headers.entries();
        for (const entry of entries) {
            const [name, value] = entry;
            const current = data[name];
            if (current === void 0) {
                data[name] = headers.get(name);
            }
            else if (current instanceof Array) {
                current.push(value);
            }
            else {
                data[name] = [current];
            }
        }
        return data;
    }
    /**
     * Request a new response from the API using a frontend HTTP client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static async request(input) {
        const response = await fetch(input.url, {
            method: input.method,
            headers: new Headers(input.headers),
            body: input.content ? JSON.stringify(input.content) : void 0
        });
        const body = await response.text();
        return {
            input: input,
            status: {
                code: response.status,
                message: response.statusText
            },
            headers: this.getHeaders(response.headers),
            body: body.length > 0 ? JSON.parse(body) : void 0
        };
    }
};
__decorate([
    Class.Private()
], Frontend, "getHeaders", null);
__decorate([
    Class.Public()
], Frontend, "request", null);
Frontend = __decorate([
    Class.Describe()
], Frontend);
exports.Frontend = Frontend;
