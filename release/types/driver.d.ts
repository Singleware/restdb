/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
/**
 * Data driver class.
 */
export declare class Driver implements Mapping.Driver {
    /**
     * Api endpoint base URL.
     */
    private apiUrl?;
    /**
     * Api key for authenticated requests.
     */
    private apiKey?;
    /**
     * Gets the path from the specified model type.
     * @param model Mode type.
     * @returns Returns the path.
     * @throws Throws an error when the model type is not valid.
     */
    private getPath;
    /**
     * Extract all columns from the given entity list into a raw object.
     * @param entities Entities list.
     * @returns Returns the new generated list.
     */
    private extractArray;
    /**
     * Extract all columns from the given entity into a raw object.
     * @param entity Entity data.
     * @returns Returns the new generated object.
     */
    private extractObject;
    /**
     * Extract the value from the given entity into a raw value.
     * @param value Value to be extracted.
     * @returns Returns the new generated object.
     */
    private extractValue;
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
     * Insert the specified entity into the API.
     * @param model Model type.
     * @param entities Entity data list.
     * @returns Returns the list inserted entities.
     */
    insert<T extends Mapping.Entity>(model: Class.Constructor<Mapping.Entity>, ...entities: T[]): Promise<string[]>;
    /**
     * Find the corresponding entity from the API.
     * @param model Model type.
     * @param filter Filter expression.
     * @param aggregate Joined columns.
     * @returns Returns the list of entities found.
     */
    find<T extends Mapping.Entity>(model: Class.Constructor<T>, filter: Mapping.Expression, aggregate: Mapping.Aggregate[]): Promise<T[]>;
    /**
     * Find the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id value.
     * @param aggregate Joined columns.
     * @returns Returns a promise to get the found entity or undefined when the entity was not found.
     */
    findById<T extends Mapping.Entity>(model: Class.Constructor<T>, value: any, aggregate: Mapping.Aggregate[]): Promise<T | undefined>;
    /**
     * Update all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param filter Filter expression.
     * @param entity Entity data to be updated.
     * @returns Returns the number of updated entities.
     */
    update(model: Class.Constructor<Mapping.Entity>, filter: Mapping.Expression, entity: Mapping.Entity): Promise<number>;
    /**
     * Update the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id.
     * @param entity Entity data to be updated.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    updateById(model: Class.Constructor<Mapping.Entity>, value: any, entity: Mapping.Entity): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified filter.
     * @param model Model type.
     * @param filter Filter columns.
     * @return Returns the number of deleted entities.
     */
    delete(model: Class.Constructor<Mapping.Entity>, filter: Mapping.Expression): Promise<number>;
    /**
     * Delete the entity that corresponds to the specified entity id.
     * @param model Model type.
     * @param value Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    deleteById(model: Class.Constructor<Mapping.Entity>, value: any): Promise<boolean>;
}
