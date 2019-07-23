/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Mapping from '@singleware/mapping';

import * as Request from '../request';

import { Status } from './status';
import { Headers } from '../headers';

/**
 * Output response interface.
 */
export interface Output {
  /**
   * Request input.
   */
  input: Request.Input;
  /**
   * Output status.
   */
  status: Status;
  /**
   * Output headers.
   */
  headers: Headers;
  /**
   * Output body.
   */
  body?: Mapping.Types.Entity;
}
