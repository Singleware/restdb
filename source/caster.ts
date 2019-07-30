/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

/**
 * ISO date aliases.
 */
type ISODate<T> = T | Date | string;

/**
 * Caster helper class.
 */
@Class.Describe()
export class Caster extends Class.Null {
  /**
   * Try to converts the specified value to an ISO date object or string according to the type casting.
   * @param value Casting value.
   * @param type Casting type.
   * @returns Returns the converted when the conversion was successful, otherwise returns the same input.
   */
  @Class.Public()
  public static ISODate<T>(value: T | (T | T[])[], type: Mapping.Types.Cast): ISODate<T> | (ISODate<T> | ISODate<T>[])[] {
    if (type === Mapping.Types.Cast.Input) {
      return Mapping.Castings.ISODate.String(value, type);
    } else if (type === Mapping.Types.Cast.Output) {
      return Mapping.Castings.ISODate.Object(value, type);
    } else {
      return value;
    }
  }
}
