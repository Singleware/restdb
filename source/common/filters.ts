/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Aliases from '../aliases';

import { Query } from './query';

/**
 * Common driver, filters class.
 */
@Class.Describe()
export class Filters extends Class.Null {
  /**
   * Magic query prefix.
   */
  @Class.Private()
  private static QueryPrefix = 'query';

  /**
   * Magic fields prefix.
   */
  @Class.Private()
  private static FieldsPrefix = 'fields';

  /**
   * Magic pre-match prefix.
   */
  @Class.Private()
  private static PreMatchPrefix = 'pre';

  /**
   * Magic post-match prefix.
   */
  @Class.Private()
  private static PostMatchPrefix = 'post';

  /**
   * Magic sort prefix.
   */
  @Class.Private()
  private static SortPrefix = 'sort';

  /**
   * Magic limit prefix.
   */
  @Class.Private()
  private static LimitPrefix = 'limit';

  /**
   * Packs the specified list of viewed fields into a parameterized array of viewed fields.
   * @param fields Viewed fields.
   * @returns Returns the parameterized array of viewed fields.
   */
  @Class.Private()
  private static packViewedFields(fields: string[]): (string | number)[] {
    return [this.FieldsPrefix, fields.length, ...fields];
  }

  /**
   * Unpacks the parameterized array of viewed fields into a list of viewed fields.
   * @param array Parameterized array of viewed fields.
   * @returns Returns the list of viewed fields or undefined when there no viewed fields.
   * @throws Throws an error when there are invalid serialized data.
   */
  @Class.Private()
  private static unpackViewedFields(array: string[]): string[] {
    if (this.FieldsPrefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of viewed fields.`);
    }
    const length = parseInt(<string>array.pop());
    if (array.length < length) {
      throw new Error(`Invalid size for the given array of viewed fields.`);
    }
    const fields = [];
    for (let i = 0; i < length; ++i) {
      fields.push(<string>array.pop());
    }
    return fields;
  }

  /**
   * Packs the specified matching rules into a parameterized array of matching rules.
   * @param model Model type.
   * @param match Matching rules.
   * @returns Returns the parameterized array of matching rules.
   * @throws Throws an error when there are invalid matching operator codes.
   */
  @Class.Private()
  private static packMatchRules(prefix: string, model: Aliases.Model, match: Aliases.Match | Aliases.Match[]): (number | string)[] {
    const rules = [];
    let total = 0;
    for (const fields of match instanceof Array ? match : [match]) {
      const expression = [];
      let length = 0;
      for (const name in fields) {
        const schema = Aliases.Schema.getRealColumn(model, name);
        const operation = fields[name];
        expression.push(schema.name, operation.operator);
        length++;
        switch (operation.operator) {
          case Aliases.Operator.Less:
          case Aliases.Operator.LessOrEqual:
          case Aliases.Operator.Equal:
          case Aliases.Operator.NotEqual:
          case Aliases.Operator.GreaterOrEqual:
          case Aliases.Operator.Greater:
            expression.push(encodeURIComponent(operation.value));
            break;
          case Aliases.Operator.Between:
          case Aliases.Operator.Contain:
          case Aliases.Operator.NotContain:
            if (!(operation.value instanceof Array)) {
              throw new Error(`Match value for '${schema.name}' should be an Array object.`);
            }
            expression.push(operation.value.length, ...operation.value.map(item => encodeURIComponent(item)));
            break;
          case Aliases.Operator.RegEx:
            if (!(operation.value instanceof RegExp)) {
              throw new Error(`Match value for '${schema.name}' should be a RegExp object.`);
            }
            expression.push(encodeURIComponent(operation.value.source));
            expression.push(encodeURIComponent(operation.value.flags));
            break;
          default:
            throw new TypeError(`Invalid operator '${operation.operator}' for the match operation.`);
        }
      }
      if (length > 0) {
        rules.push(length, ...expression);
        total++;
      }
    }
    return [prefix, total, ...rules];
  }

  /**
   * Unpacks the parameterized array of matching rules into the matching rules.
   * @param model Model type.
   * @param array Parameterized array of matching rules.
   * @returns Returns the generated matching rules or undefined when there's no rules.
   * @throws Throws an error when there are invalid serialized data.
   */
  @Class.Private()
  private static unpackMatchRules(prefix: string, model: Aliases.Model, array: string[]): Aliases.Match | Aliases.Match[] | undefined {
    if (prefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of matching lists.`);
    }
    const match = [];
    for (let total = parseInt(<string>array.pop()); total > 0; --total) {
      const fields = <Aliases.Match>{};
      for (let length = parseInt(<string>array.pop()); length > 0; --length) {
        const name = <string>array.pop();
        const operator = parseInt(<string>array.pop());
        const schema = Aliases.Schema.getRealColumn(model, name);
        switch (operator) {
          case Aliases.Operator.Less:
          case Aliases.Operator.LessOrEqual:
          case Aliases.Operator.Equal:
          case Aliases.Operator.NotEqual:
          case Aliases.Operator.GreaterOrEqual:
          case Aliases.Operator.Greater:
            fields[schema.name] = { operator: operator, value: decodeURIComponent(<string>array.pop()) };
            break;
          case Aliases.Operator.Between:
          case Aliases.Operator.Contain:
          case Aliases.Operator.NotContain:
            const values = [];
            for (let i = parseInt(<string>array.pop()); i > 0; --i) {
              values.push(decodeURIComponent(<string>array.pop()));
            }
            fields[schema.name] = { operator: operator, value: values };
            break;
          case Aliases.Operator.RegEx:
            const regexp = decodeURIComponent(<string>array.pop());
            const flags = decodeURIComponent(<string>array.pop());
            fields[schema.name] = { operator: operator, value: new RegExp(regexp, flags) };
            break;
          default:
            throw new TypeError(`Invalid operator code for the match operation.`);
        }
      }
      match.push(fields);
    }
    if (match.length > 0) {
      return match.length === 1 ? match[0] : match;
    }
    return void 0;
  }

  /**
   * Packs the specified sorting fields into a parameterized array of sorting fields.
   * @param model Model type.
   * @param sort Sorting fields.
   * @returns Returns the parameterized array of sorting fields.
   */
  @Class.Private()
  private static packSort(model: Aliases.Model, sort: Aliases.Sort): (number | string)[] {
    const fields = [];
    let length = 0;
    for (const name in sort) {
      fields.push(Aliases.Schema.getRealColumn(model, name).name, sort[name]);
      length++;
    }
    return [this.SortPrefix, length, ...fields];
  }

  /**
   * Unpacks the parameterized array of sorting fields into the sorting fields.
   * @param model Model type.
   * @param array Parameterized array of sorting fields.
   * @returns Returns the generated sorting fields.
   * @throws Throws an error when there are invalid serialized data.
   */
  @Class.Private()
  private static unpackSort(model: Aliases.Model, array: string[]): Aliases.Sort {
    if (this.SortPrefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of sorting list.`);
    }
    const fields = <Aliases.Sort>{};
    for (let length = parseInt(<string>array.pop()); length > 0; --length) {
      const name = <string>array.pop();
      const order = parseInt(<string>array.pop());
      const schema = Aliases.Schema.getRealColumn(model, name);
      switch (order) {
        case Aliases.Order.Ascending:
        case Aliases.Order.Descending:
          fields[schema.name] = order;
          break;
        default:
          throw new Error(`Invalid sorting order code.`);
      }
    }
    return fields;
  }

  /**
   * Packs the specified limit entity into a parameterized array of limits.
   * @param limit Limit entity.
   * @returns Returns the parameterized array of limits.
   */
  @Class.Private()
  private static packLimit(limit: Aliases.Limit): (string | number)[] {
    return [this.LimitPrefix, limit.start || 0, limit.count || 0];
  }

  /**
   * Unpacks the parameterized array of limits into the limit entity.
   * @param array Parameterized array of limits.
   * @returns Returns the generated limit entity.
   * @throws Throws an error when there are invalid serialized data.
   */
  @Class.Private()
  private static unpackLimit(array: string[]): Aliases.Limit {
    if (this.LimitPrefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of limits.`);
    }
    return {
      start: parseInt(<string>array.pop()) || 0,
      count: parseInt(<string>array.pop()) || 0
    };
  }

  /**
   * Build a query string URL from the specified entity model, viewed fields and query filter.
   * @param model Model type.
   * @param query Query filter.
   * @param fields Viewed fields.
   * @returns Returns the generated query string URL.
   */
  @Class.Public()
  public static toURL(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string {
    const queries = <(string | number)[]>[];
    if (fields && fields.length > 0) {
      queries.push(...this.packViewedFields(fields));
    }
    if (query) {
      if (query.pre) {
        queries.push(...this.packMatchRules(this.PreMatchPrefix, model, query.pre));
      }
      if (query.post) {
        queries.push(...this.packMatchRules(this.PostMatchPrefix, model, query.post));
      }
      if (query.sort) {
        queries.push(...this.packSort(model, query.sort));
      }
      if (query.limit) {
        queries.push(...this.packLimit(query.limit));
      }
    }
    return queries.length ? `${this.QueryPrefix}/${queries.join('/')}` : ``;
  }

  /**
   * Builds a query entity from the specified query URL.
   * @param model Model type.
   * @param url Query URL.
   * @returns Returns the generated query entity.
   * @throws Throws an error when there are unsupported data serialization in the specified URL.
   */
  @Class.Public()
  public static fromURL(model: Aliases.Model, url: string): Query {
    const result = <Query>{ fields: [] };
    const parts = url.split('/').reverse();
    if (parts.pop() === this.QueryPrefix) {
      while (parts.length) {
        switch (parts[parts.length - 1]) {
          case this.PreMatchPrefix:
            result.pre = this.unpackMatchRules(this.PreMatchPrefix, model, parts);
            break;
          case this.PostMatchPrefix:
            result.post = this.unpackMatchRules(this.PostMatchPrefix, model, parts);
            break;
          case this.SortPrefix:
            result.sort = this.unpackSort(model, parts);
            break;
          case this.LimitPrefix:
            result.limit = this.unpackLimit(parts);
            break;
          case this.FieldsPrefix:
            result.fields = this.unpackViewedFields(parts);
            break;
          default:
            throw new Error(`Unsupported data serialization type.`);
        }
      }
    }
    return result;
  }
}
