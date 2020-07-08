/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

/**
 * Coder helper class.
 */
@Class.Describe()
export class Coder extends Class.Null {
  /**
   * Encodes the specified value into a base64 string.
   * @param value Input value.
   * @returns Returns the base64 string value.
   */
  @Class.Public()
  public static toBase64(value: string): string {
    if (typeof window === typeof void 0) {
      return Buffer.from(value).toString('base64');
    }
    return btoa(value);
  }

  /**
   * Decodes the specified value from a base64 string.
   * @param value Input value.
   * @returns Returns the raw string value.
   */
  @Class.Public()
  public static fromBase64(value: string): string {
    if (typeof window === typeof void 0) {
      return Buffer.from(value, 'base64').toString('utf-8');
    }
    return atob(value);
  }
}
