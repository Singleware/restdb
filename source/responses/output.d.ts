/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Requests from '../requests';
import * as Types from '../aliases';

import { Headers as ResponseHeaders } from '../headers';
import { Status } from './status';

/**
 * Output response interface.
 */
export interface Output {
  /**
   * Request input.
   */
  input: Requests.Input;
  /**
   * Output status.
   */
  status: Status;
  /**
   * Output headers.
   */
  headers: ResponseHeaders;
  /**
   * Output payload.
   */
  payload?: any;
}
