/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from '../aliases';

/**
 * Filter query interface.
 */
export interface Query {
  /**
   * Viewed fields.
   */
  fields: string[];
  /**
   * Pre-matches.
   */
  pre?: Types.Match | Types.Match[];
  /**
   * Post-matches.
   */
  post?: Types.Match | Types.Match[];
  /**
   * Sorting order.
   */
  sort?: Types.Sort;
  /**
   * Results limit.
   */
  limit?: Types.Limit;
}
