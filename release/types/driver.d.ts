/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Responses from './responses';
import * as Aliases from './aliases';
import { Method } from './method';
/**
 * Alias type for response result.
 */
declare type Response<T> = T | Promise<T>;
/**
 * Generic driver class.
 */
export declare class Driver extends Class.Null implements Aliases.Driver {
    /**
     * API base endpoint.
     */
    private apiUrl?;
    /**
     * API base headers.
     */
    private apiHeaders;
    /**
     * API errors subject.
     */
    private apiErrors;
    /**
     * Gets the request Id based on the specified entity model and entity Id.
     * @param model Entity model.
     * @param id Entity Id.
     * @returns Returns the request Id.
     */
    protected getRequestId(model: Aliases.Model, id: any): string;
    /**
     * Gets the request query string based on the specified entity model, fields and filters.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the request query string.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string;
    /**
     * Gets the request method based on the specified entity model.
     * @param model Entity model.
     * @param method Request method.
     * @returns Returns the request method.
     */
    protected getRequestMethod(model: Aliases.Model, method: Method): Method;
    /**
     * Gets the result Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the result Id, a promise to get it or undefined when the result Id wasn't found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getInsertResponse(model: Aliases.Model, response: Responses.Output): Response<string | undefined>;
    /**
     * Gets the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Responses.Output): Response<T[]>;
    /**
     * Gets the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity, a promise to get it or undefined when the entity wasn't found.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getFindByIdResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Responses.Output): Response<T | undefined>;
    /**
     * Gets the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getUpdateResponse(model: Aliases.Model, response: Responses.Output): Response<number>;
    /**
     * Gets the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getUpdateByIdResponse(model: Aliases.Model, response: Responses.Output): Response<boolean>;
    /**
     * Gets the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getReplaceByIdResponse(model: Aliases.Model, response: Responses.Output): Response<boolean>;
    /**
     * Gets the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getDeleteResponse(model: Aliases.Model, response: Responses.Output): Response<number>;
    /**
     * Gets the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getDeleteByIdResponse(model: Aliases.Model, response: Responses.Output): Response<boolean>;
    /**
     * Gets the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or a promise to get it.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getCountResponse(model: Aliases.Model, response: Responses.Output): Response<number>;
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
     * Sets a new request header.
     * @param name Header name.
     * @param value Header value.
     * @returns Returns its own instance.
     */
    protected setHeader(name: string, value: string | string[]): Driver;
    /**
     * Removes the specified header.
     * @param name Header name.
     * @returns Returns its own instance.
     */
    protected removeHeader(name: string): Driver;
    /**
     * Notify an error in the given response entity for all listeners.
     * @param model Entity model.
     * @param response Response entity.
     */
    protected notifyErrorResponse(model: Aliases.Model, response: Responses.Output): Promise<void>;
    /**
     * Gets the error subject.
     */
    readonly onError: Observable.Subject<Responses.Output>;
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
     * @returns Returns a promise to get the amount of found entities or 0 when there's an error.
     */
    count(model: Aliases.Model, query: Aliases.Query): Promise<number>;
}
export {};
