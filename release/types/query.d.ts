/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Mapping from '@singleware/mapping';

/**
 * Search query interface.
 */
export interface Query {
  /**
   * List of views.
   */
  views: string[];
  /**
   * List of filters.
   */
  filters: Mapping.Statements.Filter[];
  /**
   * Sorting order.
   */
  sort?: Mapping.Statements.Sort;
  /**
   * Results limit.
   */
  limit?: Mapping.Statements.Limit;
}
