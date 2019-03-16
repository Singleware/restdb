import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Mapping from '@singleware/mapping';
import { Response } from './response';
/**
 * Data driver class.
 */
export declare class Driver extends Class.Null implements Mapping.Driver {
    /**
     * URL base for any endpoint.
     */
    private apiUrl?;
    /**
     * Temporary path for the next request.
     */
    private apiPath?;
    /**
     * Key for authenticated requests.
     */
    private apiKey?;
    /**
     * Header name for the authentication key.
     */
    private apiHeader;
    /**
     * Last error response.
     */
    private errorResponse?;
    /**
     * Subject to notify any API error.
     */
    private errorSubject;
    /**
     * Call an HTTP request using native browser methods (frontend).
     * @param method Request method.
     * @param path Request path.
     * @param headers Request headers.
     * @param content Request content.
     * @returns Returns a promise to get the request response.
     */
    private frontCall;
    /**
     * Call an HTTP request using native nodejs methods. (backend)
     * @param method Request method.
     * @param path Request path.
     * @param headers Request headers.
     * @param content Request content.
     * @returns Returns a promise to get the request response.
     */
    private backCall;
    /**
     * Send an HTTP request.
     * @param method Request method.
     * @param path Request path.
     * @param body Request body.
     * @returns Returns a promise to get the request response.
     */
    private request;
    /**
     * Gets a new request path based on the specified route information.
     * @param route Route information.
     * @returns Returns the generated path.
     */
    private getPath;
    /**
     * Gets the error subject.
     */
    readonly onErrors: Observable.Subject<Response>;
    /**
     * Gets the last error response.
     */
    readonly lastError: Response | undefined;
    /**
     * Sets a new API key for subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path: string): Driver;
    /**
     * Sets a new API key header for subsequent requests.
     * @param header New API key header.
     * @returns Returns the own instance.
     */
    useHeader(header: string): Driver;
    /**
     * Sets a temporary path for the next request.
     * Use: {} to set the complementary path string.
     * @param path Path to be set.
     * @returns Returns the own instance.
     */
    usePath(path: string): Driver;
    /**
     * Connect to the API.
     * @param url Api URL.
     * @param key Api key.
     */
    connect(url: string, key?: string): Promise<void>;
    /**
     * Insert the specified entity using the POST request.
     * @param model Model type.
     * @param view View mode.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     */
    insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, view: string, entities: T[]): Promise<string[]>;
    /**
     * Search for all entities that corresponds to the specified filters using the GET request.
     * @param model Model type.
     * @param view View mode.
     * @param filter Fields filter.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns a promise to get the list of entities found.
     */
    find<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, view: string, filter: Mapping.Statements.Filter, sort?: Mapping.Statements.Sort, limit?: Mapping.Statements.Limit): Promise<T[]>;
    /**
     * Find the entity that corresponds to the specified entity id using the GET request.
     * @param model Model type.
     * @param view View mode.
     * @param id Entity id.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    findById<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, view: string, id: any): Promise<T | undefined>;
    /**
     * Update all entities that corresponds to the specified filter using the PATCH request.
     * @param model Model type.
     * @param view View mode.
     * @param filter Fields filter.
     * @param entity Entity data.
     * @returns Returns a promise to get the number of updated entities.
     * @throws Throws an error when the response doesn't have the object with the total of updated results.
     */
    update(model: Mapping.Types.Model, view: string, filter: Mapping.Statements.Filter, entity: Mapping.Types.Entity): Promise<number>;
    /**
     * Update the entity that corresponds to the specified entity id using the PATCH request.
     * @param model Model type.
     * @param view View mode.
     * @param id Entity id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    updateById(model: Mapping.Types.Model, view: string, id: any, entity: Mapping.Types.Entity): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified filter using the DELETE request.
     * @param model Model type.
     * @param filter Fields filter.
     * @return Returns a promise to get the number of deleted entities.
     * @throws Throws an error when the response doesn't have the object with the total of deleted results.
     */
    delete(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): Promise<number>;
    /**
     * Delete the entity that corresponds to the specified id using the DELETE request.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    deleteById(model: Mapping.Types.Model, id: any): Promise<boolean>;
}
