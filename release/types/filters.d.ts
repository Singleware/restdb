/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
/**
 * URL path filter class.
 */
export declare class Filters extends Class.Null {
    /**
     * Magic path prefix.
     */
    private static PREFIX;
    /**
     * Build a URL path filter from the specified filter expression.
     * @param model Model type.
     * @param filter Filter expression.
     * @returns Returns the generated URL path filter.
     * @throws Throws an error when there is a nonexistent column in the specified filter.
     */
    static toURL(model: Class.Constructor<Mapping.Entity>, filter: Mapping.Expression): string;
    /**
     * Builds a filter expression from the specified URL path filter.
     * @param model Model type.
     * @param path Filter path.
     * @returns Returns the generated filter expression.
     * @throws Throws an error when there is a nonexistent column or unsupported operator in the specified filter.
     */
    static fromURL(model: Class.Constructor<Mapping.Entity>, path: string): Mapping.Entity;
}
