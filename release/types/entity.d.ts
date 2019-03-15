import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
/**
 * Entity helper class.
 */
export declare class Entity extends Class.Null {
    /**
     * Extract all properties from the given entity list into a raw object array.
     * @param entities Entities list.
     * @returns Returns the new generated list.
     */
    static extractArray(entities: any[]): any[];
    /**
     * Extract all properties from the given entity into a raw object map.
     * @param entity Entity data.
     * @returns Returns the new generated object.
     */
    static extractMap(entity: Mapping.Types.Entity): Mapping.Types.Entity;
    /**
     * Extract the value from the given entity into a raw value.
     * @param value Value to be extracted.
     * @returns Returns the new generated object.
     */
    static extractValue(value: any): any;
}
