import * as Class from '@singleware/class';
import * as Response from '../response';
import { Input } from './input';
/**
 * Backend client class.
 */
export declare class Backend extends Class.Null {
    /**
     * Request a new response from the API using a backend HTTP client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static request(input: Input): Promise<Response.Output>;
}
