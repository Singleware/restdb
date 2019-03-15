import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
import { Query } from './query';
/**
 * Search helper class.
 */
export declare class Search extends Class.Null {
    /**
     * Magic query prefix.
     */
    private static QueryPrefix;
    /**
     * Magic filter prefix.
     */
    private static FilterPrefix;
    /**
     * Magic sort prefix.
     */
    private static SortPrefix;
    /**
     * Magic limit prefix.
     */
    private static LimitPrefix;
    /**
     * Serializes the specified filter object according to the specified data model.
     * @param model Model type.
     * @param queries Query parameters list.
     * @param filter Filter statement.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static serializeFilter;
    /**
     * Unserializes the specified filter string according to the specified data model.
     * @param model Model type.
     * @param filter Filter string.
     * @returns Returns the generated filter object.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static unserializeFilter;
    /**
     * Serializes the specified sort object according to the specified data model.
     * @param model Model type.
     * @param queries Query parameters list.
     * @param sort Sorting order.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static serializeSort;
    /**
     * Unserializes the specified sort string according to the specified data model.
     * @param model Model type.
     * @param sort Sort string.
     * @returns Returns the generated sort object.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static unserializeSort;
    /**
     * Serializes the specified limit object.
     * @param queries Query parameters list.
     * @param limit Limit object.
     */
    private static serializeLimit;
    /**
     * Unserializes the specified limit string.
     * @param limit Limit string.
     * @returns Returns the generated limit object.
     */
    private static unserializeLimit;
    /**
     * Build a query URL from the specified parameters.
     * @param model Model type.
     * @param filters List of filters.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns the generated URL path filter.
     * @throws Throws an error when there is a nonexistent column in the specified filter.
     */
    static toURL(model: Mapping.Types.Model, filters: Mapping.Statements.Filter[], sort?: Mapping.Statements.Sort, limit?: Mapping.Statements.Limit): string;
    /**
     * Builds a query object from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query object.
     * @throws Throws an error when there is a nonexistent column or unsupported data in the specified URL.
     */
    static fromURL(model: Mapping.Types.Model, url: string): Query;
}
