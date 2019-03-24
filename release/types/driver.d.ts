import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Mapping from '@singleware/mapping';
import * as Response from './response';
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
    private apiKeyHeader;
    /**
     * Header name for the counting results.
     */
    private apiCountHeader;
    /**
     * Last error response.
     */
    private errorResponse?;
    /**
     * Subject to notify any API error.
     */
    private errorSubject;
    /**
     * Send an HTTP request.
     * @param method Request method.
     * @param path Request path.
     * @param content Request content.
     * @returns Returns a promise to get the response output.
     */
    private request;
    /**
     * Gets a new request path based on the specified route entity.
     * @param route Route entity.
     * @returns Returns the generated path.
     */
    private getPath;
    /**
     * Gets the error subject.
     */
    readonly onErrors: Observable.Subject<Response.Output>;
    /**
     * Gets the last error response.
     */
    readonly lastError: Response.Output | undefined;
    /**
     * Sets a new API key for the subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path: string): Driver;
    /**
     * Sets a new API key header for the subsequent requests.
     * @param header New API key header name.
     * @returns Returns the own instance.
     */
    useKeyHeaderName(header: string): Driver;
    /**
     * Sets a new API count header for the subsequent requests.
     * @param header New API count header name.
     * @returns Returns the own instance.
     */
    useCountHeaderName(header: string): Driver;
    /**
     * Sets a temporary path for the next request.
     * Variables:
     *  {model} - It will be replaced by the entity name.
     *  {query} - It will be replaced by the request query.
     *  {id}    - It will be replaced by the request ID.
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
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param views View modes.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     * @throws Throws an error when the result body doesn't contains the insertion id.
     */
    insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, views: string[], entities: T[]): Promise<string[]>;
    /**
     * Search for all entities that corresponds to the specified filter using a GET request.
     * @param model Model type.
     * @param views View modes.
     * @param filter Fields filter.
     * @returns Returns a promise to get the list of found entities.
     * @throws Throws an error when the result body isn't an array.
     */
    find<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, views: string[], filter: Mapping.Statements.Filter): Promise<T[]>;
    /**
     * Find the entity that corresponds to the specified id using a GET request.
     * @param model Model type.
     * @param views View modes.
     * @param id Entity id.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    findById<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, views: string[], id: any): Promise<T | undefined>;
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param views View modes.
     * @param match Matching fields.
     * @param entity Entity data.
     * @returns Returns a promise to get the number of updated entities.
     */
    update(model: Mapping.Types.Model, views: string[], match: Mapping.Statements.Match, entity: Mapping.Types.Entity): Promise<number>;
    /**
     * Update the entity that corresponds to the specified id using a PATCH request.
     * @param model Model type.
     * @param views View modes.
     * @param id Entity id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    updateById(model: Mapping.Types.Model, views: string[], id: any, entity: Mapping.Types.Entity): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @return Returns a promise to get the number of deleted entities.
     */
    delete(model: Mapping.Types.Model, match: Mapping.Statements.Match): Promise<number>;
    /**
     * Delete the entity that corresponds to the specified id using a DELETE request.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    deleteById(model: Mapping.Types.Model, id: any): Promise<boolean>;
    /**
     * Count all corresponding entities using the a HEAD request
     * @param model Model type.
     * @param views View modes.
     * @param filter Field filter.
     * @returns Returns a promise to get the total of found entities.
     */
    count(model: Mapping.Types.Model, views: string[], filter: Mapping.Statements.Filter): Promise<number>;
}
