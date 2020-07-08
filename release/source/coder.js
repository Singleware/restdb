"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coder = void 0;
/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
/**
 * Coder helper class.
 */
let Coder = class Coder extends Class.Null {
    /**
     * Encodes the specified value into a base64 string.
     * @param value Input value.
     * @returns Returns the base64 string value.
     */
    static toBase64(value) {
        if (typeof window === typeof void 0) {
            return Buffer.from(value).toString('base64');
        }
        return btoa(value);
    }
    /**
     * Decodes the specified value from a base64 string.
     * @param value Input value.
     * @returns Returns the raw string value.
     */
    static fromBase64(value) {
        if (typeof window === typeof void 0) {
            return Buffer.from(value, 'base64').toString('utf-8');
        }
        return atob(value);
    }
};
__decorate([
    Class.Public()
], Coder, "toBase64", null);
__decorate([
    Class.Public()
], Coder, "fromBase64", null);
Coder = __decorate([
    Class.Describe()
], Coder);
exports.Coder = Coder;
//# sourceMappingURL=coder.js.map