/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

import { Query } from './query';

/**
 * Search helper class.
 */
@Class.Describe()
export class Search extends Class.Null {
  /**
   * Magic query prefix.
   */
  @Class.Private()
  private static QueryPrefix = 'query';

  /**
   * Magic filter prefix.
   */
  @Class.Private()
  private static FilterPrefix = 'f';

  /**
   * Magic sort prefix.
   */
  @Class.Private()
  private static SortPrefix = 's';

  /**
   * Magic limit prefix.
   */
  @Class.Private()
  private static LimitPrefix = 'l';

  /**
   * Serializes the specified filter object according to the specified data model.
   * @param model Model type.
   * @param queries Query parameters list.
   * @param filter Filter statement.
   * @throws Throws an exception when the specified column does not exists in the provided data model.
   */
  @Class.Private()
  private static serializeFilter(model: Mapping.Types.Model, queries: any[], filter: Mapping.Statements.Filter): void {
    let parts = [];
    for (const name in filter) {
      const schema = Mapping.Schema.getRealColumn(model, name);
      if (!schema) {
        throw new Error(`Column '${name}' does not exists.`);
      }
      const operation = filter[name];
      const expression = `${schema.name}:${operation.operator}`;
      switch (operation.operator) {
        case Mapping.Statements.Operator.REGEX:
        case Mapping.Statements.Operator.LESS:
        case Mapping.Statements.Operator.LESS_OR_EQUAL:
        case Mapping.Statements.Operator.EQUAL:
        case Mapping.Statements.Operator.NOT_EQUAL:
        case Mapping.Statements.Operator.GREATER_OR_EQUAL:
        case Mapping.Statements.Operator.GREATER:
          parts.push(`${expression}:${encodeURIComponent(operation.value)}`);
          break;
        case Mapping.Statements.Operator.BETWEEN:
        case Mapping.Statements.Operator.CONTAIN:
        case Mapping.Statements.Operator.NOT_CONTAIN:
          parts.push(`${expression}:${[...operation.value].map(item => encodeURIComponent(item)).join(',')}`);
          break;
      }
    }
    if (parts.length) {
      queries.push(`${Search.FilterPrefix}/${parts.join(';')}`);
    }
  }

  /**
   * Unserializes the specified filter string according to the specified data model.
   * @param model Model type.
   * @param filter Filter string.
   * @returns Returns the generated filter object.
   * @throws Throws an exception when the specified column does not exists in the provided data model.
   */
  @Class.Private()
  private static unserializeFilter(model: Mapping.Types.Model, filter: string): Mapping.Statements.Filter {
    const newer = <Mapping.Statements.Filter>{};
    const fields = filter.split(';');
    for (const field of fields) {
      const [name, operator, value] = field.split(':', 3);
      if (!Mapping.Schema.getRealColumn(model, name)) {
        throw new Error(`Column '${name}' does not exists.`);
      }
      const code = parseInt(operator);
      switch (code) {
        case Mapping.Statements.Operator.REGEX:
        case Mapping.Statements.Operator.LESS:
        case Mapping.Statements.Operator.LESS_OR_EQUAL:
        case Mapping.Statements.Operator.EQUAL:
        case Mapping.Statements.Operator.NOT_EQUAL:
        case Mapping.Statements.Operator.GREATER_OR_EQUAL:
        case Mapping.Statements.Operator.GREATER:
          newer[name] = { operator: code, value: decodeURIComponent(value) };
          break;
        case Mapping.Statements.Operator.BETWEEN:
        case Mapping.Statements.Operator.CONTAIN:
        case Mapping.Statements.Operator.NOT_CONTAIN:
          newer[name] = { operator: code, value: value.split(',').map(value => decodeURIComponent(value)) };
          break;
        default:
          throw new Error(`Unsupported filter operator code "${code}"`);
      }
    }
    return newer;
  }

  /**
   * Serializes the specified sort object according to the specified data model.
   * @param model Model type.
   * @param queries Query parameters list.
   * @param sort Sorting order.
   * @throws Throws an exception when the specified column does not exists in the provided data model.
   */
  @Class.Private()
  private static serializeSort(model: Mapping.Types.Model, queries: any[], sort: Mapping.Statements.Sort): void {
    let parts = [];
    for (const name in sort) {
      const schema = Mapping.Schema.getRealColumn(model, name);
      if (!schema) {
        throw new Error(`Column '${name}' does not exists.`);
      }
      parts.push(`${schema.name}:${sort[name]}`);
    }
    if (parts.length) {
      queries.push(`${Search.SortPrefix}/${parts.join(';')}`);
    }
  }

  /**
   * Unserializes the specified sort string according to the specified data model.
   * @param model Model type.
   * @param sort Sort string.
   * @returns Returns the generated sort object.
   * @throws Throws an exception when the specified column does not exists in the provided data model.
   */
  @Class.Private()
  private static unserializeSort(model: Mapping.Types.Model, sort: string): Mapping.Statements.Sort {
    const newer = <Mapping.Statements.Sort>{};
    const fields = sort.split(';');
    for (const field of fields) {
      const [name, order] = field.split(':', 2);
      if (!Mapping.Schema.getRealColumn(model, name)) {
        throw new Error(`Column '${name}' does not exists.`);
      }
      const code = parseInt(order);
      switch (code) {
        case Mapping.Statements.Order.ASCENDING:
        case Mapping.Statements.Order.DESCENDING:
          newer[name] = code;
          break;
        default:
          throw new Error(`Unsupported sorting order code "${code}"`);
      }
    }
    return newer;
  }

  /**
   * Serializes the specified limit object.
   * @param queries Query parameters list.
   * @param limit Limit object.
   */
  @Class.Private()
  private static serializeLimit(queries: any[], limit: Mapping.Statements.Limit): void {
    queries.push(`${Search.LimitPrefix}/${limit.start || 0};${limit.count || 0}`);
  }

  /**
   * Unserializes the specified limit string.
   * @param limit Limit string.
   * @returns Returns the generated limit object.
   */
  @Class.Private()
  private static unserializeLimit(limit: string): Mapping.Statements.Limit {
    const [start, count] = limit.split(';', 2);
    return {
      start: parseInt(start),
      count: parseInt(count)
    };
  }

  /**
   * Build a query URL from the specified parameters.
   * @param model Model type.
   * @param filters List of filters.
   * @param sort Sorting fields.
   * @param limit Result limits.
   * @returns Returns the generated URL path filter.
   * @throws Throws an error when there is a nonexistent column in the specified filter.
   */
  @Class.Public()
  public static toURL(
    model: Mapping.Types.Model,
    filters: Mapping.Statements.Filter[],
    sort?: Mapping.Statements.Sort,
    limit?: Mapping.Statements.Limit
  ): string {
    const statements = <any[]>[];
    for (const filter of filters) {
      Search.serializeFilter(model, statements, filter);
    }
    if (sort) {
      Search.serializeSort(model, statements, sort);
    }
    if (limit) {
      Search.serializeLimit(statements, limit);
    }
    return statements.length ? `/${this.QueryPrefix}/${statements.join('/')}` : ``;
  }

  /**
   * Builds a query object from the specified query URL.
   * @param model Model type.
   * @param url Query URL.
   * @returns Returns the generated query object.
   * @throws Throws an error when there is a nonexistent column or unsupported data in the specified URL.
   */
  @Class.Public()
  public static fromURL(model: Mapping.Types.Model, url: string): Query {
    const result = <Query>{ filters: <Mapping.Statements.Filter[]>[], sort: void 0, limit: void 0 };
    const parts = url.split('/').reverse();
    if (parts.pop() === this.QueryPrefix) {
      while (parts.length) {
        const data = parts.pop();
        switch (data) {
          case this.FilterPrefix:
            result.filters.push(Search.unserializeFilter(model, parts.pop() || ''));
            break;
          case this.SortPrefix:
            result.sort = Search.unserializeSort(model, parts.pop() || '');
            break;
          case this.LimitPrefix:
            result.limit = Search.unserializeLimit(parts.pop() || '');
            break;
          default:
            throw new Error(`Unsupported serialized data type "${data}"`);
        }
      }
    }
    return result;
  }
}
