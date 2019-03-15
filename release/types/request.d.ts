/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Mapping from '@singleware/mapping';

/**
 * Request interface.
 */
export interface Request {
  /**
   * Request URL.
   */
  url: string;
  /**
   * Request body.
   */
  body?: Mapping.Types.Entity;
}
