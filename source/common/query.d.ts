/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from '../types';

/**
 * Filter query interface.
 */
export interface Query extends Types.Query {
  /**
   * Fields to select.
   */
  fields: string[];
}
