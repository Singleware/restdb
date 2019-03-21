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
     * Magic views prefix.
     */
    private static ViewsPrefix;
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
     * Packs the specified view modes.
     * @param queries Query parameters list.
     * @param views View modes.
     */
    private static packViews;
    /**
     * Unpacks the specified view modes string.
     * @param views View modes string.
     * @returns Returns the generated list of view modes.
     */
    private static unpackViews;
    /**
     * Packs the specified filters entity according to the given data model.
     * @param model Model type.
     * @param queries Query parameters list.
     * @param filter Filters entity.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static packFilters;
    /**
     * Unpacks the specified filters string according to the specified data model.
     * @param model Model type.
     * @param filter Filters string.
     * @returns Returns the generated filter object.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static unpackFilters;
    /**
     * Packs the specified sort object according to the specified data model.
     * @param model Model type.
     * @param queries Query parameters list.
     * @param sort Sorting order.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static packSort;
    /**
     * Unpacks the specified sort string according to the specified data model.
     * @param model Model type.
     * @param sort Sort string.
     * @returns Returns the generated sort object.
     * @throws Throws an exception when the specified column does not exists in the provided data model.
     */
    private static unpackSort;
    /**
     * Packs the specified limit object.
     * @param queries Query parameters list.
     * @param limit Limit object.
     */
    private static packLimit;
    /**
     * Unpacks the specified limit string.
     * @param limit Limit string.
     * @returns Returns the generated limit object.
     */
    private static unpackLimit;
    /**
     * Build a query URL from the specified parameters.
     * @param model Model type.
     * @param views View modes.
     * @param filters Filter fields.
     * @param sort Sorting fields.
     * @param limit Result limits.
     * @returns Returns the generated URL path filter.
     * @throws Throws an error when there is a nonexistent column in the specified filter.
     */
    static toURL(model: Mapping.Types.Model, views: string[], filters?: Mapping.Statements.Filter, sort?: Mapping.Statements.Sort, limit?: Mapping.Statements.Limit): string;
    /**
     * Builds a query object from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query object.
     * @throws Throws an error when there is a nonexistent column or unsupported data in the specified URL.
     */
    static fromURL(model: Mapping.Types.Model, url: string): Query;
}
