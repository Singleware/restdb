/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

/**
 * Entity helper class.
 */
@Class.Describe()
export class Entity extends Class.Null {
  /**
   * Extract all properties from the given entity array into a raw object array.
   * @param entities Entity array.
   * @returns Returns the new raw entity array.
   */
  @Class.Public()
  public static extractArray(entities: any[]): any[] {
    const newer = <Mapping.Types.Entity[]>[];
    for (const entity of entities) {
      newer.push(this.extractValue(entity));
    }
    return newer;
  }

  /**
   * Extract all properties from the given entity map into a raw object map.
   * @param entity Entity map.
   * @returns Returns the new raw object map.
   */
  @Class.Public()
  public static extractMap(entity: Mapping.Types.Entity): Mapping.Types.Entity {
    const newer = <Mapping.Types.Entity>{};
    for (const column in entity) {
      newer[column] = this.extractValue(entity[column]);
    }
    return newer;
  }

  /**
   * Extracts the raw value from the specified value.
   * @param value Input value.
   * @returns Returns the new raw value or the original value when there's no value to be extracted.
   */
  @Class.Public()
  public static extractValue(value: any): any {
    if (value instanceof Array) {
      return this.extractArray(value);
    } else if (value instanceof Object) {
      return this.extractMap(value);
    }
    return value;
  }
}
