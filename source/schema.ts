/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

import { Caster } from './caster';

/**
 * Schema helper class.
 */
@Class.Describe()
export class Schema extends Mapping.Schema {
  /**
   * Decorates the specified property to be a date column.
   * @param minimum Minimum date.
   * @param maximum Maximum date.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Date(minimum?: Date, maximum?: Date): Mapping.Types.PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      super.Date(minimum, maximum)(scope, <string>property, descriptor);
      return super.Convert(Caster.ISODate)(scope, <string>property, descriptor);
    };
  }
}
