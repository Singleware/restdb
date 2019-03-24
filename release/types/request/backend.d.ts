import * as Class from '@singleware/class';
import * as Response from '../response';
import { Input } from './input';
/**
 * Backend client class.
 */
export declare class Backend extends Class.Null {
    static request(input: Input): Promise<Response.Output>;
}
