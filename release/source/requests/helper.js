"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
/**
 * Request helper class.
 */
let Helper = class Helper extends Class.Null {
    /**
     * Check whether or not the specified status code is in the acceptable range.
     * @param status Status code.
     * @returns Returns true when the specified status code is accepted, false otherwise.
     */
    static isAcceptedStatusCode(status) {
        return (status >= 200 && status <= 299) || (status >= 400 && status <= 499);
    }
    /**
     * Check if the specified content type is accepted based on the expected content types.
     * @param content Content type.
     * @param expected Expected content types.
     * @returns Returns true when the specified content type is accepted, false otherwise.
     */
    static isAcceptedContentType(content, ...expected) {
        const index = content.indexOf(';');
        const mime = content.substr(0, index === -1 ? content.length : index);
        return expected.includes(mime.trim());
    }
};
__decorate([
    Class.Public()
], Helper, "isAcceptedStatusCode", null);
__decorate([
    Class.Public()
], Helper, "isAcceptedContentType", null);
Helper = __decorate([
    Class.Describe()
], Helper);
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map