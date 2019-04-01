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
     * Packs the specified list of view modes into a parameterized array of view modes.
     * @param views View modes.
     * @returns Returns the parameterized array of view modes.
     */
    private static packViewModes;
    /**
     * Unpacks the parameterized array of view modes into a list of view modes.
     * @param array Parameterized array of view modes.
     * @returns Returns the list of view modes.
     * @throws Throws an error when there are invalid serialized data.
     */
    private static unpackViewModes;
    /**
     * Packs the specified matching rules into a parameterized array of matching rules.
     * @param model Model type.
     * @param match Matching rules.
     * @returns Returns the parameterized array of matching rules.
     * @throws Throws an error when there are invalid matching operator codes.
     */
    private static packMatchRules;
    /**
     * Unpacks the parameterized array of matching rules into the matching rules.
     * @param model Model type.
     * @param array Parameterized array of matching rules.
     * @returns Returns the generated matching rules.
     * @throws Throws an error when there are invalid serialized data.
     */
    private static unpackMatchRules;
    /**
     * Packs the specified sorting fields into a parameterized array of sorting fields.
     * @param model Model type.
     * @param sort Sorting fields.
     * @returns Returns the parameterized array of sorting fields.
     */
    private static packSort;
    /**
     * Unpacks the parameterized array of sorting fields into the sorting fields.
     * @param model Model type.
     * @param array Parameterized array of sorting fields.
     * @returns Returns the generated sorting fields.
     * @throws Throws an error when there are invalid serialized data.
     */
    private static unpackSort;
    /**
     * Packs the specified limit entity into a parameterized array of limits.
     * @param limit Limit entity.
     * @returns Returns the parameterized array of limits.
     */
    private static packLimit;
    /**
     * Unpacks the parameterized array of limits into the limit entity.
     * @param array Parameterized array of limits.
     * @returns Returns the generated limit entity.
     * @throws Throws an error when there are invalid serialized data.
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
     * @throws Throws an error when there are unsupported data serialization in the specified URL.
     */
    static fromURL(model: Mapping.Types.Model, url: string): Query;
}
