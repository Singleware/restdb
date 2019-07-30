/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Response from './response';
import * as Aliases from './aliases';
/**
 * Alias type for parsed response results.
 */
declare type Parsed<T> = T | Promise<T>;
/**
 * Generic driver class.
 */
export declare class Driver extends Class.Null implements Aliases.Driver {
    /**
     * Base URL for any endpoint.
     */
    private apiUrl?;
    /**
     * Header value for authenticated requests.
     */
    private apiKeyValue?;
    /**
     * Header name for authenticated requests.
     */
    private apiKeyHeader;
    /**
     * Subject to notify any API error.
     */
    private errorSubject;
    /**
     * Gets a new request path based on the specified route entity.
     * @param route Route entity.
     * @returns Returns the generated request path.
     */
    private getRequestPath;
    /**
     * Send an HTTP request and gets the response.
     * @param method Request method.
     * @param path Request path.
     * @param payload Request payload.
     * @returns Returns a promise to get the response output.
     */
    private getRequestResponse;
    /**
     * Parses the request Id based on the specified entity model and entity Id.
     * @param model Entity model.
     * @param id Entity Id.
     * @returns Returns the parsed entity Id.
     */
    protected parseRequestId(model: Aliases.Model, id: any): string;
    /**
     * Parses the request query string based on the specified entity model, fields and filters.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the parsed query string.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string;
    /**
     * Parses the inserted Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the inserted Id, a promise to get or undefined when the inserted Id was not found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseInsertResponse(model: Aliases.Model, response: Response.Output): Parsed<string | undefined>;
    /**
     * Parses the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): Parsed<T[]>;
    /**
     * Parses the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity, a promise to get it or undefined when the entity was not found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseFindByIdResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): Parsed<T | undefined>;
    /**
     * Parses the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseUpdateResponse(model: Aliases.Model, response: Response.Output): Parsed<number>;
    /**
     * Parses the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseUpdateByIdResponse(model: Aliases.Model, response: Response.Output): Parsed<boolean>;
    /**
     * Parses the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseReplaceByIdResponse(model: Aliases.Model, response: Response.Output): Parsed<boolean>;
    /**
     * Parses the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseDeleteResponse(model: Aliases.Model, response: Response.Output): Parsed<number>;
    /**
     * Parses the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseDeleteByIdResponse(model: Aliases.Model, response: Response.Output): Parsed<boolean>;
    /**
     * Parses the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseCountResponse(model: Aliases.Model, response: Response.Output): Parsed<number>;
    /**
     * Parses the error response from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     */
    protected parseErrorResponse(model: Aliases.Model, response: Response.Output): void;
    /**
     * Sets a new key header name for the subsequent requests.
     * @param name New header name.
     * @returns Returns the own instance.
     */
    protected setKeyHeaderName(name: string): Driver;
    /**
     * Sets a new key header value for the subsequent requests.
     * @param value New header value.
     * @returns Returns the own instance.
     */
    protected setKeyHeaderValue(value: string): Driver;
    /**
     * Sets a new key header name and value for the subsequent requests.
     * @param name New header name.
     * @param value New header value.
     * @returns Returns the own instance.
     */
    protected setKeyHeader(name: string, value: string): Driver;
    /**
     * Gets the error subject.
     */
    readonly onErrors: Observable.Subject<Response.Output>;
    /**
     * Connect to the API.
     * @param url Api URL.
     */
    connect(url: string): Promise<void>;
    /**
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @returns Returns a promise to get the id list of all inserted entities.
     * @throws Throws an error when the result payload doesn't contains the insertion id.
     */
    insert<T extends Aliases.Entity>(model: Aliases.Model, entities: T[]): Promise<string[]>;
    /**
     * Search for all entities that corresponds to the specified filter using a GET request.
     * @param model Model type.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns a promise to get the list of found entities.
     * @throws Throws an error when the result payload isn't an array.
     */
    find<T extends Aliases.Entity>(model: Aliases.Model<T>, query: Aliases.Query, fields: string[]): Promise<T[]>;
    /**
     * Find the entity that corresponds to the specified Id using a GET request.
     * @param model Model type.
     * @param id Entity Id.
     * @param fields Viewed fields.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    findById<T extends Aliases.Entity>(model: Aliases.Model<T>, id: any, fields: string[]): Promise<T | undefined>;
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param match Matching fields.
     * @param entity Entity data.
     * @returns Returns a promise to get the number of updated entities.
     */
    update(model: Aliases.Model, match: Aliases.Match, entity: Aliases.Entity): Promise<number>;
    /**
     * Update the entity that corresponds to the specified Id using a PATCH request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    updateById(model: Aliases.Model, id: any, entity: Aliases.Entity): Promise<boolean>;
    /**
     * Replace the entity that corresponds to the specified Id using a PUT request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
     */
    replaceById(model: Aliases.Model, id: any, entity: Aliases.Entity): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @return Returns a promise to get the number of deleted entities.
     */
    delete(model: Aliases.Model, match: Aliases.Match): Promise<number>;
    /**
     * Delete the entity that corresponds to the specified Id using a DELETE request.
     * @param model Model type.
     * @param id Entity Id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    deleteById(model: Aliases.Model, id: any): Promise<boolean>;
    /**
     * Count all corresponding entities using the a HEAD request.
     * @param model Model type.
     * @param query Query filter.
     * @returns Returns a promise to get the total amount of found entities.
     */
    count(model: Aliases.Model, query: Aliases.Query): Promise<number>;
}
export {};
