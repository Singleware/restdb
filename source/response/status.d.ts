/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Mapping from '@singleware/mapping';

/**
 * Status interface.
 */
export interface Status {
  /**
   * Status code.
   */
  code: number;
  /**
   * Status message.
   */
  message: string;
}
