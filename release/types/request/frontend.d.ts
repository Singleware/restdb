/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Response from '../response';
import { Input } from './input';
/**
 * Frontend client class.
 */
export declare class Frontend extends Class.Null {
    /**
     * Get all response headers as native headers map.
     * @param headers Non-native headers object.
     * @returns Returns the native headers map.
     */
    private static getResponseHeaders;
    /**
     * Gets the response output entity.
     * @param input Request input.
     * @param payload Response payload.
     * @param response Response object.
     * @returns Returns the response output entity.
     */
    private static getResponseOutput;
    /**
     * Request a new response from the API using a frontend HTTP/HTTPS client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static request(input: Input): Promise<Response.Output>;
}
