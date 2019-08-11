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
const Mapping = require("@singleware/mapping");
const coder_1 = require("./coder");
/**
 * Caster helper class.
 */
let Caster = class Caster extends Class.Null {
    /**
     * Try to convert the given value to an ISO date object or string according to the specified type casting.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the converted value when the conversion was successful, otherwise returns the given input.
     */
    static ISODate(value, type) {
        if (type === Mapping.Types.Cast.Input) {
            return Mapping.Castings.ISODate.String(value, type);
        }
        else if (type === Mapping.Types.Cast.Output) {
            return Mapping.Castings.ISODate.Object(value, type);
        }
        return value;
    }
    /**
     * Try to encrypt or decrypt the given value using base64 algorithm according to the specified type casting.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the converted value when the conversion was successful, otherwise returns the given input.
     */
    static Base64(value, type) {
        if (value instanceof Array) {
            return value.map(value => this.Base64(value, type));
        }
        else if (type === Mapping.Types.Cast.Input) {
            return coder_1.Coder.toBase64(value);
        }
        else if (type === Mapping.Types.Cast.Output) {
            return coder_1.Coder.fromBase64(value);
        }
        else {
            return value;
        }
    }
};
__decorate([
    Class.Public()
], Caster, "ISODate", null);
__decorate([
    Class.Public()
], Caster, "Base64", null);
Caster = __decorate([
    Class.Describe()
], Caster);
exports.Caster = Caster;
//# sourceMappingURL=caster.js.map