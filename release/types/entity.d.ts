/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
/**
 * Entity helper class.
 */
export declare class Entity extends Class.Null {
    /**
     * Extract all properties from the given entity array into a raw object array.
     * @param entities Entity array.
     * @returns Returns the new raw entity array.
     */
    static extractArray(entities: any[]): any[];
    /**
     * Extract all properties from the given entity map into a raw object map.
     * @param entity Entity map.
     * @returns Returns the new raw object map.
     */
    static extractMap(entity: Mapping.Types.Entity): Mapping.Types.Entity;
    /**
     * Extracts the raw value from the specified value.
     * @param value Input value.
     * @returns Returns the new raw value or the original value when there's no value to be extracted.
     */
    static extractValue(value: any): any;
}
