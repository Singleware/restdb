/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Responses from './responses';
import * as Types from './types';
import { Options } from './options';
/**
 * Generic driver class.
 */
export declare class Driver extends Class.Null implements Types.Driver {
    /**
     * API base endpoint.
     */
    private apiUrl?;
    /**
     * API base headers.
     */
    private apiHeaders;
    /**
     * API auth headers.
     */
    private apiAuthHeaders;
    /**
     * Get the insert result from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the insertion result or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getInsertResponse<R>(model: Types.Model, response: Responses.Output): never | R | Promise<R | undefined> | undefined;
    /**
     * Get the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getFindResponse<R>(model: Types.Model, response: Responses.Output): never | R[] | Promise<R[] | undefined> | undefined;
    /**
     * Get the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity, a promise to get it or undefined when the entity wasn't found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getFindByIdResponse<R>(model: Types.Model, response: Responses.Output): never | R | Promise<R | undefined> | undefined;
    /**
     * Get the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getUpdateResponse(model: Types.Model, response: Responses.Output): never | number | undefined;
    /**
     * Get the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getUpdateByIdResponse(model: Types.Model, response: Responses.Output): never | boolean | undefined;
    /**
     * Get the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getReplaceByIdResponse(model: Types.Model, response: Responses.Output): never | boolean | undefined;
    /**
     * Get the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getDeleteResponse(model: Types.Model, response: Responses.Output): never | number | undefined;
    /**
     * Get the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getDeleteByIdResponse(model: Types.Model, response: Responses.Output): never | boolean | undefined;
    /**
     * Get the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getCountResponse(model: Types.Model, response: Responses.Output): never | number | undefined;
    /**
     * Get the request query string based on the specified entity model, filters and fields.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Fields to select.
     * @returns Returns the request query string.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getRequestQuery(model: Types.Model, query?: Types.Query, fields?: string[]): never | string;
    /**
     * Get the request Id based on the specified entity model and entity Id.
     * @param model Entity model.
     * @param id Entity Id.
     * @returns Returns the request Id.
     */
    protected getRequestId<I>(model: Types.Model, id: I): string;
    /**
     * Get a new request path based on the specified route entity.
     * @param route Route entity.
     * @returns Returns the generated request path.
     */
    private getRequestPath;
    /**
     * Send an HTTP request and gets the response.
     * @param method Request method.
     * @param path Request path.
     * @param auth Determines whether or not authentication is required.
     * @param payload Request payload.
     * @returns Returns a promise to get the response output.
     */
    private getRequestResponse;
    /**
     * Set a new authentication header.
     * @param name Header name.
     * @param value Header value.
     * @returns Returns the instance itself.
     */
    protected setAuthHeader(name: string, value: string | string[]): Driver;
    /**
     * Unset the specified authentication header.
     * @param name Header name.
     * @returns Returns the instance itself.
     */
    protected unsetAuthHeader(name: string): Driver;
    /**
     * Connect to the API.
     * @param url Api URL.
     */
    connect(url: string): Promise<void>;
    /**
     * Sets a new request header.
     * @param name Header name.
     * @param value Header value.
     * @returns Returns the instance itself.
     */
    setHeader(name: string, value: string | string[]): Driver;
    /**
     * Unset the specified header.
     * @param name Header name.
     * @returns Returns the instance itself.
     */
    unsetHeader(name: string): Driver;
    /**
     * Request data from the API using the given details.
     * @param details Request details.
     * @returns Returns a promise to get the payload data.
     * @throws Throws an error when the status code isn't acceptable.
     */
    request(path: string, options: Omit<Options, 'path'>, payload?: Types.Entity): Promise<Responses.Output>;
    /**
     * Insert the specified entity using a POST request.
     * @param model Model type.
     * @param entities Entity list.
     * @param options Insert options.
     * @returns Returns a promise to get the insertion results or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    insert<E, R>(model: Types.Model<E>, entities: E[], options: Options): Promise<R[] | undefined>;
    /**
     * Search for all entities that corresponds to the specified filter using a GET request.
     * @param model Model type.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @param options Find options.
     * @returns Returns a promise to get the list of found entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    find<E>(model: Types.Model<E>, query: Types.Query, fields: string[], options: Options): Promise<E[] | undefined>;
    /**
     * Find the entity that corresponds to the specified Id using a GET request.
     * @param model Model type.
     * @param id Entity Id.
     * @param fields Viewed fields.
     * @param options Find options.
     * @returns Returns a promise to get the entity either undefined when an error occurs or the entity was not found.
     * @throws Throws an error when the server response is invalid.
     */
    findById<E, I>(model: Types.Model<E>, id: I, fields: string[], options: Options): Promise<E | undefined>;
    /**
     * Update all entities that corresponds to the specified matching fields using a PATCH request.
     * @param model Model type.
     * @param match Matching fields.
     * @param entity Entity data.
     * @param options Update options.
     * @returns Returns a promise to get the number of updated entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    update<E>(model: Types.Model<E>, match: Types.Match, entity: E, options: Options): Promise<number | undefined>;
    /**
     * Update the entity that corresponds to the specified Id using a PATCH request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @param options Update options.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     * @throws Throws an error when the server response is invalid.
     */
    updateById<E, I>(model: Types.Model<E>, id: I, entity: E, options: Options): Promise<boolean | undefined>;
    /**
     * Replace the entity that corresponds to the specified Id using a PUT request.
     * @param model Model type.
     * @param id Entity Id.
     * @param entity Entity data.
     * @param options Replace options.
     * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
     * @throws Throws an error when the server response is invalid.
     */
    replaceById<E, I>(model: Types.Model<E>, id: I, entity: E, options: Options): Promise<boolean | undefined>;
    /**
     * Delete all entities that corresponds to the specified matching fields using a DELETE request.
     * @param model Model type.
     * @param match Matching fields.
     * @param options Delete options.
     * @return Returns a promise to get the number of deleted entities.
     * @throws Throws an error when the server response is invalid.
     */
    delete(model: Types.Model, match: Types.Match, options: Options): Promise<number | undefined>;
    /**
     * Delete the entity that corresponds to the specified Id using a DELETE request.
     * @param model Model type.
     * @param id Entity Id.
     * @param options Delete options.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     * @throws Throws an error when the server response is invalid.
     */
    deleteById<I>(model: Types.Model, id: I, options: Options): Promise<boolean | undefined>;
    /**
     * Count all corresponding entities using the a HEAD request.
     * @param model Model type.
     * @param query Query filter.
     * @param options Count options.
     * @returns Returns a promise to get the amount of entities.
     * @throws Throws an error when the server response is invalid.
     */
    count(model: Types.Model, query: Types.Query, options: Options): Promise<number | undefined>;
}
