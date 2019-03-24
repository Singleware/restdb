import * as Class from '@singleware/class';
import * as Response from '../response';
import { Input } from './input';
/**
 * Frontend client class.
 */
export declare class Frontend extends Class.Null {
    private static getHeaders;
    static request(input: Input): Promise<Response.Output>;
}
