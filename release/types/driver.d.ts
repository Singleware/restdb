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
     * Key for authenticated requests.
     */
    private apiKey?;
    /**
     * Temporary path for the next request.
     */
    private apiPath?;
    /**
     * Last error response.
     */
    private apiErrorResponse?;
    /**
     * Subject to notify any API error.
     */
    private apiErrorSubject;
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
     * Gets a new request path based on the specified model type.
     * @param model Mode type.
     * @param complement Path complement.
     * @returns Returns the generated path.
     * @throws Throws an error when the model type is not valid.
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
     * Sets the new API key for subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path: string): Driver;
    /**
     * Sets a temporary path for the next request.
     * Use: %0 to set the complementary path string.
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
     * Insert the specified entity by POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     */
    insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, entities: T[]): Promise<string[]>;
    /**
     * Search for the corresponding entities by GET request.
     * @param model Model type.
     * @param joins List of joins (Not supported).
     * @param filter Fields filter.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns a promise to get the list of entities found.
     */
    find<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, joins: Mapping.Statements.Join[], filter: Mapping.Statements.Filter, sort?: Mapping.Statements.Sort, limit?: Mapping.Statements.Limit): Promise<T[]>;
    /**
     * Find the entity that corresponds to the specified entity id by GET request.
     * @param model Model type.
     * @param joins Joined columns (Not supported).
     * @param id Entity id.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    findById<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, joins: Mapping.Statements.Join[], id: any): Promise<T | undefined>;
    /**
     * Update all entities that corresponds to the specified filter by PATCH request.
     * @param model Model type.
     * @param entity Entity data.
     * @param filter Fields filter.
     * @returns Returns a promise to get the number of updated entities.
     * @throws Throws an error when the response doesn't have the object with the total of updated results.
     */
    update(model: Mapping.Types.Model, entity: Mapping.Types.Entity, filter: Mapping.Statements.Filter): Promise<number>;
    /**
     * Update an entity that corresponds to the specified entity id by PATCH request.
     * @param model Model type.
     * @param entity Entity data.
     * @param id Entity id.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    updateById(model: Mapping.Types.Model, entity: Mapping.Types.Entity, id: any): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified filter by DELETE request.
     * @param model Model type.
     * @param filter Fields filter.
     * @return Returns a promise to get the number of deleted entities.
     * @throws Throws an error when the response doesn't have the object with the total of deleted results.
     */
    delete(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): Promise<number>;
    /**
     * Delete an entity that corresponds to the specified id by DELETE request.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    deleteById(model: Mapping.Types.Model, id: any): Promise<boolean>;
}
