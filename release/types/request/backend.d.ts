import * as Class from '@singleware/class';
import * as Response from '../response';
import { Input } from './input';
/**
 * Backend client class.
 */
export declare class Backend extends Class.Null {
    /**
     * Gets the request options entity.
     * @param input Request input.
     * @param url Request URL.
     * @returns Return the request options entity.
     */
    private static getRequestOptions;
    /**
     * Gets the response output entity.
     * @param input Request input.
     * @param payload Response payload.
     * @param response Response object.
     * @returns Returns the response output entity.
     */
    private static getResponseOutput;
    /**
     * Response, event handler.
     * @param input Input request.
     * @param resolve Promise resolve callback.
     * @param reject Promise reject callback.
     * @param response Request response.
     */
    private static responseHandler;
    /**
     * Request a new response from the API using a backend HTTP/HTTPS client.
     * @param input Request input.
     * @returns Returns the request output.
     */
    static request(input: Input): Promise<Response.Output>;
}
