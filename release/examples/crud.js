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
const RestDB = require("../source");
/**
 * Connection string.
 */
const connection = 'http://127.0.0.1:8080';
/**
 * Database driver.
 */
const driver = new RestDB.Common.Driver();
/**
 * Test class.
 */
let UserEntity = class UserEntity extends Class.Null {
};
__decorate([
    RestDB.Schema.Primary(),
    RestDB.Schema.Id(),
    Class.Public()
], UserEntity.prototype, "id", void 0);
__decorate([
    RestDB.Schema.String(),
    Class.Public()
], UserEntity.prototype, "firstName", void 0);
__decorate([
    RestDB.Schema.String(),
    Class.Public()
], UserEntity.prototype, "lastName", void 0);
UserEntity = __decorate([
    RestDB.Schema.Entity('UserEntity'),
    Class.Describe()
], UserEntity);
/**
 * Database mapper.
 */
let UserMapper = class UserMapper extends RestDB.Mapper {
    /**
     * Default constructor.
     */
    constructor() {
        super(driver, UserEntity);
    }
    /**
     * Create a test user.
     * @returns Returns a promise to get the new user id.
     */
    async create() {
        return await this.insert({ firstName: 'First 1', lastName: 'Last 1' });
    }
    /**
     * Change the test user.
     * @param id User id.
     * @returns Returns a promise to get the number of updated users.
     */
    async change(id) {
        return await this.update({ id: { operator: "eq" /* Equal */, value: id } }, { firstName: 'Changed!' });
    }
    /**
     * Replace the test user.
     * @param id User id.
     * @returns Returns a promise to get the replacement status.
     */
    async replace(id) {
        return await this.replaceById(id, { firstName: 'Replaced!' });
    }
    /**
     * Read the test user.
     * @param id User id.
     * @returns Returns a promise to get the list of found users.
     */
    async read(id) {
        return await this.find({
            pre: {
                id: { operator: "eq" /* Equal */, value: id }
            },
            sort: {
                id: "asc" /* Ascending */
            },
            limit: {
                start: 0,
                count: 1
            }
        });
    }
    /**
     * Remove the test user.
     * @param id User id.
     * @returns Returns a promise to get the number of removed users.
     */
    async remove(id) {
        return await this.delete({ id: { operator: "eq" /* Equal */, value: id } });
    }
};
__decorate([
    Class.Public()
], UserMapper.prototype, "create", null);
__decorate([
    Class.Public()
], UserMapper.prototype, "change", null);
__decorate([
    Class.Public()
], UserMapper.prototype, "replace", null);
__decorate([
    Class.Public()
], UserMapper.prototype, "read", null);
__decorate([
    Class.Public()
], UserMapper.prototype, "remove", null);
UserMapper = __decorate([
    Class.Describe()
], UserMapper);
/**
 * Test operations.
 */
async function crudTest() {
    // User mapper class.
    const mapper = new UserMapper();
    // Connect
    await driver.connect(connection);
    console.log('Connect');
    // Create user
    const id = await mapper.create();
    const before = await mapper.read(id);
    console.log('Create:', id, before[0].firstName, before[0].lastName);
    // Update user
    const update = await mapper.change(id);
    const middle = await mapper.read(id);
    console.log('Update:', update, middle[0].firstName, middle[0].lastName);
    // Replace user
    const replace = await mapper.replace(id);
    const after = await mapper.read(id);
    console.log('Replace:', replace, after[0].firstName, after[0].lastName);
    // Delete user
    console.log('Delete:', await mapper.remove(id));
}
crudTest();
//# sourceMappingURL=crud.js.map