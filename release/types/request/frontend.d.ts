import * as Class from '@singleware/class';
import * as Response from '../response';
import { Input } from './input';
/**
 * Frontend client class.
 */
export declare class Frontend extends Class.Null {
    /**
     * Get all the response headers as a native headers map.
     * @param headers Non-native headers object.
     * @returns Returns the native headers map.
     */
    private static getHeaders;
    /**
     * Request a new response from the API using a frontend HTTP client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static request(input: Input): Promise<Response.Output>;
}
