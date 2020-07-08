/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
/**
 * Coder helper class.
 */
export declare class Coder extends Class.Null {
    /**
     * Encodes the specified value into a base64 string.
     * @param value Input value.
     * @returns Returns the base64 string value.
     */
    static toBase64(value: string): string;
    /**
     * Decodes the specified value from a base64 string.
     * @param value Input value.
     * @returns Returns the raw string value.
     */
    static fromBase64(value: string): string;
}
