import * as Mapping from '@singleware/mapping';
/**
 * Schema helper class.
 */
export declare class Schema extends Mapping.Schema {
    /**
     * Decorates the specified property to be a date column.
     * @param minimum Minimum date.
     * @param maximum Maximum date.
     * @returns Returns the decorator method.
     */
    static Date(minimum?: Date, maximum?: Date): Mapping.Types.PropertyDecorator;
    /**
     * Decorates the specified property to be a base64 column.
     * @returns Returns the decorator method.
     */
    static Base64(): Mapping.Types.PropertyDecorator;
}
