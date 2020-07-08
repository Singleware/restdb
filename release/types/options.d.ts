/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Method } from './method';

/**
 * Request options interface.
 */
export interface Options {
  /**
   * Determines whether or not authentication is required.
   */
  auth?: boolean;
  /**
   * Method replacement.
   */
  method?: Method;
  /**
   * Path replacement.
   */
  path?: string;
}
