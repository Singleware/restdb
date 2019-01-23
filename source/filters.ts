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
  public static toURL(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): string {
    let parts = [];
    for (const name in filter) {
      const operation = filter[name];
      const schema = Mapping.Schema.getRealColumn(model, name);
      if (!schema) {
        throw new Error(`Column '${name}' does not exists.`);
      }
      const path = `${schema.name}/${operation.operator}`;
      switch (operation.operator) {
        case Mapping.Statements.Operator.REGEX:
        case Mapping.Statements.Operator.LESS:
        case Mapping.Statements.Operator.LESS_OR_EQUAL:
        case Mapping.Statements.Operator.EQUAL:
        case Mapping.Statements.Operator.NOT_EQUAL:
        case Mapping.Statements.Operator.GREATER_OR_EQUAL:
        case Mapping.Statements.Operator.GREATER:
          parts.push(`${path}/${encodeURIComponent(operation.value)}`);
          break;
        case Mapping.Statements.Operator.BETWEEN:
        case Mapping.Statements.Operator.CONTAIN:
        case Mapping.Statements.Operator.NOT_CONTAIN:
          parts.push(`${path}/${(<string[]>operation.value).map(item => encodeURIComponent(item)).join(';')}`);
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
  public static fromURL(model: Mapping.Types.Model, path: string) {
    const filters = <Mapping.Types.Entity>{};
    const parts = path.split('/').reverse();
    if (parts.pop() === this.PREFIX) {
      while (parts.length) {
        const column = <string>parts.pop();
        const operator = parseInt(<string>parts.pop());
        const value = <string>parts.pop();
        if (!Mapping.Schema.getRealColumn(model, column)) {
          throw new Error(`Column '${column}' does not exists.`);
        }
        switch (operator) {
          case Mapping.Statements.Operator.REGEX:
          case Mapping.Statements.Operator.LESS:
          case Mapping.Statements.Operator.LESS_OR_EQUAL:
          case Mapping.Statements.Operator.EQUAL:
          case Mapping.Statements.Operator.NOT_EQUAL:
          case Mapping.Statements.Operator.GREATER_OR_EQUAL:
          case Mapping.Statements.Operator.GREATER:
            filters[column] = { operator: operator, value: decodeURIComponent(value) };
            break;
          case Mapping.Statements.Operator.BETWEEN:
          case Mapping.Statements.Operator.CONTAIN:
          case Mapping.Statements.Operator.NOT_CONTAIN:
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
