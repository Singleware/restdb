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
}
