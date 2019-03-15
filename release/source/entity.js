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
 * Entity helper class.
 */
let Entity = class Entity extends Class.Null {
    /**
     * Extract all properties from the given entity list into a raw object array.
     * @param entities Entities list.
     * @returns Returns the new generated list.
     */
    static extractArray(entities) {
        const newer = [];
        for (const entity of entities) {
            newer.push(this.extractValue(entity));
        }
        return newer;
    }
    /**
     * Extract all properties from the given entity into a raw object map.
     * @param entity Entity data.
     * @returns Returns the new generated object.
     */
    static extractMap(entity) {
        const newer = {};
        for (const column in entity) {
            newer[column] = this.extractValue(entity[column]);
        }
        return newer;
    }
    /**
     * Extract the value from the given entity into a raw value.
     * @param value Value to be extracted.
     * @returns Returns the new generated object.
     */
    static extractValue(value) {
        if (value instanceof Array) {
            return this.extractArray(value);
        }
        else if (value instanceof Object) {
            return this.extractMap(value);
        }
        return value;
    }
};
__decorate([
    Class.Public()
], Entity, "extractArray", null);
__decorate([
    Class.Public()
], Entity, "extractMap", null);
__decorate([
    Class.Public()
], Entity, "extractValue", null);
Entity = __decorate([
    Class.Describe()
], Entity);
exports.Entity = Entity;
