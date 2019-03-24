import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
import { Query } from './query';
/**
 * Filters helper class.
 */
export declare class Filters extends Class.Null {
    /**
     * Magic query prefix.
     */
    private static QueryPrefix;
    /**
     * Magic views prefix.
     */
    private static ViewsPrefix;
    /**
     * Magic pre-match prefix.
     */
    private static PreMatchPrefix;
    /**
     * Magic post-match prefix.
     */
    private static PostMatchPrefix;
    /**
     * Magic sort prefix.
     */
    private static SortPrefix;
    /**
     * Magic limit prefix.
     */
    private static LimitPrefix;
    /**
     * Packs the specified view modes into the given query list.
     * @param queries Query list.
     * @param views View modes.
     */
    private static packViews;
    /**
     * Unpacks the specified view modes string into a new view modes list.
     * @param views View modes string.
     * @returns Returns the generated list of view modes.
     */
    private static unpackViews;
    /**
     * Packs the specified match rule entity according to the specified fields and model type.
     * @param model Model type.
     * @param match Matching fields.
     * @returns Returns the match rule string.
     */
    private static packMatchRule;
    /**
     * Unpacks the specified match rule string according to the specified model type.
     * @param model Model type.
     * @param match Match string.
     * @returns Returns the generated match entity.
     * @throws @throws Throws an error when there are unsupported orders in the match string.
     */
    private static unpackMatchRule;
    /**
     * Packs the specified pre-match into the query list according to the given model type.
     * @param model Model type.
     * @param queries Query list.
     * @param match Matching fields.
     */
    private static packPreMatch;
    /**
     * Packs the specified post-match into the query list according to the given model type.
     * @param model Model type.
     * @param queries Query list.
     * @param match Matching fields.
     */
    private static packPostMatch;
    /**
     * Unpacks the specified match string according to the specified model type.
     * @param model Model type.
     * @param match Match string.
     * @returns Returns a single generated match entity or the generated match entity list.
     */
    private static unpackMatch;
    /**
     * Packs the specified sort entity according to the specified model type.
     * @param model Model type.
     * @param queries Query list.
     * @param sort Sorting order.
     */
    private static packSort;
    /**
     * Unpacks the specified sort string according to the specified model type.
     * @param model Model type.
     * @param sort Sort string.
     * @returns Returns the generated sort entity.
     * @throws Throws an error when there are unsupported orders in the specified sort string.
     */
    private static unpackSort;
    /**
     * Packs the specified limit entity.
     * @param queries Query list.
     * @param limit Limit entity.
     */
    private static packLimit;
    /**
     * Unpacks the specified limit string.
     * @param limit Limit string.
     * @returns Returns the generated limit entity.
     */
    private static unpackLimit;
    /**
     * Build a query string URL from the specified view modes and field filter.
     * @param model Model type.
     * @param views View modes.
     * @param filter Field filter.
     * @returns Returns the generated query string URL.
     */
    static toURL(model: Mapping.Types.Model, views: string[], filter?: Mapping.Statements.Filter): string;
    /**
     * Builds a query entity from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query entity.
     * @throws Throws an error when there are unsupported data in the specified URL.
     */
    static fromURL(model: Mapping.Types.Model, url: string): Query;
}
