/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

/**
 * URL path filter class.
 */
@Class.Describe()
export class Filters extends Class.Null {
  /**
   * Magic path prefix.
   */
  @Class.Private()
  private static PREFIX = 'find';

  /**
   * Build a URL path filter from the specified filter expression.
   * @param model Model type.
   * @param filter Filter expression.
   * @returns Returns the generated URL path filter.
   * @throws Throws an error when there is a nonexistent column in the specified filter.
   */
  @Class.Public()
  public static toURL(model: Class.Constructor<Mapping.Entity>, filter: Mapping.Expression): string {
    let parts = [];
    for (const name in filter) {
      const operation = filter[name];
      const schema = Mapping.Schema.getColumn(model, name);
      if (!schema) {
        throw new Error(`Column '${name}' does not exists.`);
      }
      switch (operation.operator) {
        case Mapping.Operator.LESS:
        case Mapping.Operator.LESS_OR_EQUAL:
        case Mapping.Operator.EQUAL:
        case Mapping.Operator.NOT_EQUAL:
        case Mapping.Operator.GREATER_OR_EQUAL:
        case Mapping.Operator.GREATER:
          parts.push(`${schema.name}/${operation.operator}/${encodeURIComponent(operation.value)}`);
          break;
        case Mapping.Operator.BETWEEN:
        case Mapping.Operator.CONTAIN:
        case Mapping.Operator.NOT_CONTAIN:
          parts.push(`${schema.name}/${operation.operator}/${(<string[]>operation.value).map(item => encodeURIComponent(item)).join(';')}`);
          break;
      }
    }
    return parts.length ? `/${this.PREFIX}/${parts.join('/')}` : ``;
  }

  /**
   * Builds a filter expression from the specified URL path filter.
   * @param model Model type.
   * @param path Filter path.
   * @returns Returns the generated filter expression.
   * @throws Throws an error when there is a nonexistent column or unsupported operator in the specified filter.
   */
  @Class.Public()
  public static fromURL(model: Class.Constructor<Mapping.Entity>, path: string) {
    const filters = <Mapping.Entity>{};
    const parts = path.split('/').reverse();
    if (parts.pop() === this.PREFIX) {
      while (parts.length) {
        const column = <string>parts.pop();
        const operator = parseInt(<string>parts.pop());
        const value = <string>parts.pop();
        if (!Mapping.Schema.getColumn(model, column)) {
          throw new Error(`Column '${column}' does not exists.`);
        }
        switch (operator) {
          case Mapping.Operator.LESS:
          case Mapping.Operator.LESS_OR_EQUAL:
          case Mapping.Operator.EQUAL:
          case Mapping.Operator.NOT_EQUAL:
          case Mapping.Operator.GREATER_OR_EQUAL:
          case Mapping.Operator.GREATER:
            filters[column] = { operator: operator, value: decodeURIComponent(value) };
            break;
          case Mapping.Operator.BETWEEN:
          case Mapping.Operator.CONTAIN:
          case Mapping.Operator.NOT_CONTAIN:
            filters[column] = { operator: operator, value: value.split(';').map(item => decodeURIComponent(item)) };
            break;
          default:
            throw new Error(`Unsupported operator "${operator}"`);
        }
      }
    }
    return filters;
  }
}
