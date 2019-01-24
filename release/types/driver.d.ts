/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
/**
 * Data driver class.
 */
export declare class Driver extends Class.Null implements Mapping.Driver {
    /**
     * Api endpoint base URL.
     */
    private apiUrl?;
    /**
     * Api key for authenticated requests.
     */
    private apiKey?;
    /**
     * Api temporary path.
     */
    private apiPath?;
    /**
     * Gets a new request path based on the specified model type.
     * @param model Mode type.
     * @param complement Path complement.
     * @returns Returns the generated path.
     * @throws Throws an error when the model type is not valid.
     */
    private getPath;
    /**
     * Extract all properties from the given entity list into a raw object array.
     * @param entities Entities list.
     * @returns Returns the new generated list.
     */
    private static extractArray;
    /**
     * Extract all properties from the given entity into a raw object map.
     * @param entity Entity data.
     * @returns Returns the new generated object.
     */
    private static extractMap;
    /**
     * Extract the value from the given entity into a raw value.
     * @param value Value to be extracted.
     * @returns Returns the new generated object.
     */
    private static extractValue;
    /**
     * Send an HTTP request.
     * @param method Request method.
     * @param path Request path.
     * @param body Request body.
     * @returns Returns a promise to get the HTTP response.
     */
    private request;
    /**
     * Connect to the API.
     * @param url Api URL.
     * @param key Api key.
     */
    connect(url: string, key?: string): Promise<void>;
    /**
     * Sets the new API key for subsequent requests.
     * @param key New API key.
     * @returns Returns the own instance.
     */
    useKey(path: string): Driver;
    /**
     * Set a temporary path for the next request.
     * Use: %0 to set the complementary path string.
     * @param path Path to be set.
     * @returns Returns the own instance.
     */
    usePath(path: string): Driver;
    /**
     * Insert the specified entity into the API.
     * @param model Model type.
     * @param entities Entity data list.
     * @returns Returns the list inserted entities.
     */
    insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, entities: T[]): Promise<string[]>;
    /**
     * Find the corresponding entity from the API.
     * @param model Model type.
     * @param joins List of junctions (Not supported).
     * @param filters List of filters.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns the list of entities found.
     */
    find<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, joins: Mapping.Statements.Join[], filters: Mapping.Statements.Filter[], sort?: Mapping.Statements.Sort, limit?: Mapping.Statements.Limit): Promise<T[]>;
    /**
     * Find the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id value.
     * @param aggregate Joined columns.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    findById<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, joins: Mapping.Statements.Join[], id: any): Promise<T | undefined>;
    /**
     * Update all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param entity Entity data to be updated.
     * @param filter Filter expression.
     * @returns Returns the number of updated entities.
     */
    update(model: Mapping.Types.Model, entity: Mapping.Types.Entity, filter: Mapping.Statements.Filter): Promise<number>;
    /**
     * Update the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param entity Entity data to be updated.
     * @param id Entity id.s
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    updateById(model: Mapping.Types.Model, entity: Mapping.Types.Entity, id: any): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param filter Filter columns.
     * @return Returns the number of deleted entities.
     */
    delete(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): Promise<number>;
    /**
     * Delete the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    deleteById(model: Mapping.Types.Model, id: any): Promise<boolean>;
}
