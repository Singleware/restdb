/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Mapping from '@singleware/mapping';

import { Request } from './request';

/**
 * Response interface.
 */
export interface Response {
  /**
   * Request information.
   */
  request: Request;
  /**
   * Status code of the response.
   */
  statusCode: number;
  /**
   * Status text of the response.
   */
  statusText: string;
  /**
   * Response body.
   */
  body?: Mapping.Types.Entity;
}
