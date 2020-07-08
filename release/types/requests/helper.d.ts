/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
/**
 * Request helper class.
 */
export declare class Helper extends Class.Null {
    /**
     * Check whether or not the specified status code is in the acceptable range.
     * @param status Status code.
     * @returns Returns true when the specified status code is accepted, false otherwise.
     */
    static isAcceptedStatusCode(status: number): boolean;
    /**
     * Check if the specified content type is accepted based on the expected content types.
     * @param content Content type.
     * @param expected Expected content types.
     * @returns Returns true when the specified content type is accepted, false otherwise.
     */
    static isAcceptedContentType(content: string, ...expected: string[]): boolean;
}
