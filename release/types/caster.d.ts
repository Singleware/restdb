/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
/**
 * Caster helper class.
 */
export declare class Caster extends Class.Null {
    /**
     * Try to convert the given value to an ISO date object or string according to the specified type casting.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the converted value when the conversion was successful, otherwise returns the given input.
     */
    static ISODate<T>(value: T | T[], type: Mapping.Types.Cast): (T | string | Date) | (T | string | Date)[];
    /**
     * Try to encrypt or decrypt the given value using base64 algorithm according to the specified type casting.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the converted value when the conversion was successful, otherwise returns the given input.
     */
    static Base64<T>(value: T | T[], type: Mapping.Types.Cast): (T | string) | (T | string)[];
}
