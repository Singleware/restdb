/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Types from '../types';
import { Query } from './query';
/**
 * Common driver, filters class.
 */
export declare class Filters extends Class.Null {
    /**
     * Magic query prefix.
     */
    private static QueryPrefix;
    /**
     * Magic fields prefix.
     */
    private static FieldsPrefix;
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
     * Packs the specified list of viewed fields into a parameterized array of viewed fields.
     * @param fields Viewed fields.
     * @returns Returns the parameterized array of viewed fields.
     */
    private static packViewedFields;
    /**
     * Unpacks the parameterized array of viewed fields into a list of viewed fields.
     * @param array Parameterized array of viewed fields.
     * @returns Returns the list of viewed fields or undefined when there no viewed fields.
     * @throws Throws an error when there are invalid serialized data.
     */
    private static unpackViewedFields;
    /**
     * Pack a new operation in the given operations list based on the specified path, operator and value.
     * @param operations Operations list.
     * @param path Operation path.
     * @param operator Operator type.
     * @param value Operation value.
     */
    private static packOperation;
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
     * @returns Returns the generated matching rules or undefined when there's no rules.
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
     * Build a query string URL from the specified entity model, viewed fields and query filter.
     * @param model Model type.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the generated query string URL.
     */
    static toURL(model: Types.Model, query?: Types.Query, fields?: string[]): string;
    /**
     * Builds a query entity from the specified query URL.
     * @param model Model type.
     * @param url Query URL.
     * @returns Returns the generated query entity.
     * @throws Throws an error when there are unsupported data serialization in the specified URL.
     */
    static fromURL(model: Types.Model, url: string): Query;
}
