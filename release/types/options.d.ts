/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Method } from './method';

/**
 * Request options interface.
 */
export interface Options {
  /**
   * Method replacement.
   */
  method?: Method;
  /**
   * Path replacement.
   */
  path?: string;
}
