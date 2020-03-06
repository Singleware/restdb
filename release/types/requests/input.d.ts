/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from '../types';

import { Headers } from '../headers';

/**
 * Input request interface.
 */
export interface Input {
  /**
   * Input method.
   */
  method: string;
  /**
   * Input URL.
   */
  url: string;
  /**
   * Input headers.
   */
  headers: Headers;
  /**
   * Input payload.
   */
  payload?: Types.Entity | Types.Entity[];
}
