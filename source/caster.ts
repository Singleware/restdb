/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

import { Coder } from './coder';

/**
 * Caster helper class.
 */
@Class.Describe()
export class Caster extends Class.Null {
  /**
   * Try to convert the given value to an ISO date object or string according to the specified type casting.
   * @param value Casting value.
   * @param type Casting type.
   * @returns Returns the converted value when the conversion was successful, otherwise returns the given input.
   */
  @Class.Public()
  public static ISODate<T>(value: T | T[], type: Mapping.Types.Cast): (T | string | Date) | (T | string | Date)[] {
    if (type === Mapping.Types.Cast.Input) {
      return Mapping.Castings.ISODate.String(value, type);
    } else if (type === Mapping.Types.Cast.Output) {
      return Mapping.Castings.ISODate.Object(value, type);
    }
    return value;
  }

  /**
   * Try to encrypt or decrypt the given value using base64 algorithm according to the specified type casting.
   * @param value Casting value.
   * @param type Casting type.
   * @returns Returns the converted value when the conversion was successful, otherwise returns the given input.
   */
  @Class.Public()
  public static Base64<T>(value: T | T[], type: Mapping.Types.Cast): (T | string) | (T | string)[] {
    if (value instanceof Array) {
      return value.map(value => <T | string>this.Base64(value, type));
    } else if (type === Mapping.Types.Cast.Input) {
      return Coder.toBase64(<any>value);
    } else if (type === Mapping.Types.Cast.Output) {
      return Coder.fromBase64(<any>value);
    } else {
      return value;
    }
  }
}
