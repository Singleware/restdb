/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

import { Query } from './query';

/**
 * Filters helper class.
 */
@Class.Describe()
export class Filters extends Class.Null {
  /**
   * Magic query prefix.
   */
  @Class.Private()
  private static QueryPrefix = 'query';

  /**
   * Magic views prefix.
   */
  @Class.Private()
  private static ViewsPrefix = 'views';

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
   * Packs the specified list of view modes into a parameterized array of view modes.
   * @param views View modes.
   * @returns Returns the parameterized array of view modes.
   */
  @Class.Private()
  private static packViewModes(views: string[]): (string | number)[] {
    return [this.ViewsPrefix, views.length, ...views];
  }

  /**
   * Unpacks the parameterized array of view modes into a list of view modes.
   * @param array Parameterized array of view modes.
   * @returns Returns the list of view modes or undefined when there no view modes.
   * @throws Throws an error when there are invalid serialized data.
   */
  @Class.Private()
  private static unpackViewModes(array: string[]): string[] {
    if (this.ViewsPrefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of view modes.`);
    }
    const length = parseInt(<string>array.pop());
    if (array.length < length) {
      throw new Error(`Invalid size for the given array of view modes.`);
    }
    const views = [];
    for (let i = 0; i < length; ++i) {
      views.push(<string>array.pop());
    }
    return views;
  }

  /**
   * Packs the specified matching rules into a parameterized array of matching rules.
   * @param model Model type.
   * @param match Matching rules.
   * @returns Returns the parameterized array of matching rules.
   * @throws Throws an error when there are invalid matching operator codes.
   */
  @Class.Private()
  private static packMatchRules(prefix: string, model: Mapping.Types.Model, match: Mapping.Statements.Match | Mapping.Statements.Match[]): (number | string)[] {
    const rules = [];
    let total = 0;
    for (const fields of match instanceof Array ? match : [match]) {
      const expression = [];
      let length = 0;
      for (const name in fields) {
        const schema = Mapping.Schema.getRealColumn(model, name);
        const operation = fields[name];
        expression.push(schema.name, operation.operator);
        length++;
        switch (operation.operator) {
          case Mapping.Statements.Operator.LESS:
          case Mapping.Statements.Operator.LESS_OR_EQUAL:
          case Mapping.Statements.Operator.EQUAL:
          case Mapping.Statements.Operator.NOT_EQUAL:
          case Mapping.Statements.Operator.GREATER_OR_EQUAL:
          case Mapping.Statements.Operator.GREATER:
            expression.push(encodeURIComponent(operation.value));
            break;
          case Mapping.Statements.Operator.BETWEEN:
          case Mapping.Statements.Operator.CONTAIN:
          case Mapping.Statements.Operator.NOT_CONTAIN:
            if (!(operation.value instanceof Array)) {
              throw new Error(`Match value for '${schema.name}' should be an Array object.`);
            }
            expression.push(operation.value.length, ...operation.value.map(item => encodeURIComponent(item)));
            break;
          case Mapping.Statements.Operator.REGEX:
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
  private static unpackMatchRules(prefix: string, model: Mapping.Types.Model, array: string[]): Mapping.Statements.Match | Mapping.Statements.Match[] | undefined {
    if (prefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of matching lists.`);
    }
    const match = [];
    for (let total = parseInt(<string>array.pop()); total > 0; --total) {
      const fields = <Mapping.Statements.Match>{};
      for (let length = parseInt(<string>array.pop()); length > 0; --length) {
        const name = <string>array.pop();
        const operator = parseInt(<string>array.pop());
        const schema = Mapping.Schema.getRealColumn(model, name);
        switch (operator) {
          case Mapping.Statements.Operator.LESS:
          case Mapping.Statements.Operator.LESS_OR_EQUAL:
          case Mapping.Statements.Operator.EQUAL:
          case Mapping.Statements.Operator.NOT_EQUAL:
          case Mapping.Statements.Operator.GREATER_OR_EQUAL:
          case Mapping.Statements.Operator.GREATER:
            fields[schema.name] = { operator: operator, value: decodeURIComponent(<string>array.pop()) };
            break;
          case Mapping.Statements.Operator.BETWEEN:
          case Mapping.Statements.Operator.CONTAIN:
          case Mapping.Statements.Operator.NOT_CONTAIN:
            const values = [];
            for (let i = parseInt(<string>array.pop()); i > 0; --i) {
              values.push(decodeURIComponent(<string>array.pop()));
            }
            fields[schema.name] = { operator: operator, value: values };
            break;
          case Mapping.Statements.Operator.REGEX:
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
  private static packSort(model: Mapping.Types.Model, sort: Mapping.Statements.Sort): (number | string)[] {
    const fields = [];
    let length = 0;
    for (const name in sort) {
      fields.push(Mapping.Schema.getRealColumn(model, name).name, sort[name]);
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
  private static unpackSort(model: Mapping.Types.Model, array: string[]): Mapping.Statements.Sort {
    if (this.SortPrefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of sorting list.`);
    }
    const fields = <Mapping.Statements.Sort>{};
    for (let length = parseInt(<string>array.pop()); length > 0; --length) {
      const name = <string>array.pop();
      const order = parseInt(<string>array.pop());
      const schema = Mapping.Schema.getRealColumn(model, name);
      switch (order) {
        case Mapping.Statements.Order.ASCENDING:
        case Mapping.Statements.Order.DESCENDING:
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
  private static packLimit(limit: Mapping.Statements.Limit): (string | number)[] {
    return [this.LimitPrefix, limit.start || 0, limit.count || 0];
  }

  /**
   * Unpacks the parameterized array of limits into the limit entity.
   * @param array Parameterized array of limits.
   * @returns Returns the generated limit entity.
   * @throws Throws an error when there are invalid serialized data.
   */
  @Class.Private()
  private static unpackLimit(array: string[]): Mapping.Statements.Limit {
    if (this.LimitPrefix !== array.pop()) {
      throw new Error(`Invalid magic prefix for the given array of limits.`);
    }
    return {
      start: parseInt(<string>array.pop()) || 0,
      count: parseInt(<string>array.pop()) || 0
    };
  }

  /**
   * Build a query string URL from the specified view modes and field filter.
   * @param model Model type.
   * @param views View modes.
   * @param filter Field filter.
   * @returns Returns the generated query string URL.
   */
  @Class.Public()
  public static toURL(model: Mapping.Types.Model, views?: string[], filter?: Mapping.Statements.Filter): string {
    const queries = <(string | number)[]>[];
    if (views && views.length > 0) {
      queries.push(...this.packViewModes(views));
    }
    if (filter) {
      if (filter.pre) {
        queries.push(...this.packMatchRules(this.PreMatchPrefix, model, filter.pre));
      }
      if (filter.post) {
        queries.push(...this.packMatchRules(this.PostMatchPrefix, model, filter.post));
      }
      if (filter.sort) {
        queries.push(...this.packSort(model, filter.sort));
      }
      if (filter.limit) {
        queries.push(...this.packLimit(filter.limit));
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
  public static fromURL(model: Mapping.Types.Model, url: string): Query {
    const result = <Query>{ views: [] };
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
          case this.ViewsPrefix:
            result.views = this.unpackViewModes(parts);
            break;
          default:
            throw new Error(`Unsupported data serialization type.`);
        }
      }
    }
    return result;
  }
}
