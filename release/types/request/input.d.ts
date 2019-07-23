/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Mapping from '@singleware/mapping';

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
   * Input content.
   */
  content?: Mapping.Types.Entity;
}
