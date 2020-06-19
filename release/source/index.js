"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Common = exports.Responses = exports.Requests = void 0;
/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
var coder_1 = require("./coder");
Object.defineProperty(exports, "Coder", { enumerable: true, get: function () { return coder_1.Coder; } });
var caster_1 = require("./caster");
Object.defineProperty(exports, "Caster", { enumerable: true, get: function () { return caster_1.Caster; } });
var driver_1 = require("./driver");
Object.defineProperty(exports, "Driver", { enumerable: true, get: function () { return driver_1.Driver; } });
var schema_1 = require("./schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return schema_1.Schema; } });
var method_1 = require("./method");
Object.defineProperty(exports, "Method", { enumerable: true, get: function () { return method_1.Method; } });
var types_1 = require("./types");
Object.defineProperty(exports, "Mapper", { enumerable: true, get: function () { return types_1.Mapper; } });
var types_2 = require("./types");
Object.defineProperty(exports, "Inputer", { enumerable: true, get: function () { return types_2.Inputer; } });
Object.defineProperty(exports, "Outputer", { enumerable: true, get: function () { return types_2.Outputer; } });
Object.defineProperty(exports, "Normalizer", { enumerable: true, get: function () { return types_2.Normalizer; } });
Object.defineProperty(exports, "Castings", { enumerable: true, get: function () { return types_2.Castings; } });
// Imported aliases.
const Requests = require("./requests");
const Responses = require("./responses");
const Common = require("./common");
/**
 * Request namespace.
 */
exports.Requests = Requests;
/**
 * Response namespace.
 */
exports.Responses = Responses;
/**
 * Common driver namespace.
 */
exports.Common = Common;
//# sourceMappingURL=index.js.map