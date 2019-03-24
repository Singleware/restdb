/*
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
  private static ViewsPrefix = 'v';

  /**
   * Magic pre-match prefix.
   */
  @Class.Private()
  private static PreMatchPrefix = 'b';

  /**
   * Magic post-match prefix.
   */
  @Class.Private()
  private static PostMatchPrefix = 'a';

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
   * Packs the specified view modes into the given query list.
   * @param queries Query list.
   * @param views View modes.
   */
  @Class.Private()
  private static packViews(queries: string[], views: string[]): void {
    const list = views.filter(view => view !== Mapping.Types.View.ALL);
    if (list.length > 0) {
      queries.push(`${this.ViewsPrefix}/${list.join(';')}`);
    }
  }

  /**
   * Unpacks the specified view modes string into a new view modes list.
   * @param views View modes string.
   * @returns Returns the generated list of view modes.
   */
  @Class.Private()
  private static unpackViews(views: string): string[] {
    return views.split(';');
  }

  /**
   * Packs the specified match rule entity according to the specified fields and model type.
   * @param model Model type.
   * @param match Matching fields.
   * @returns Returns the match rule string.
   */
  @Class.Private()
  private static packMatchRule(model: Mapping.Types.Model, match: Mapping.Statements.Match): string {
    let matches = [];
    for (const name in match) {
      const schema = Mapping.Schema.getRealColumn(model, name);
      const operation = match[name];
      const expression = `${schema.name}:${operation.operator}`;
      switch (operation.operator) {
        case Mapping.Statements.Operator.REGEX:
        case Mapping.Statements.Operator.LESS:
        case Mapping.Statements.Operator.LESS_OR_EQUAL:
        case Mapping.Statements.Operator.EQUAL:
        case Mapping.Statements.Operator.NOT_EQUAL:
        case Mapping.Statements.Operator.GREATER_OR_EQUAL:
        case Mapping.Statements.Operator.GREATER:
          matches.push(`${expression}:${encodeURIComponent(operation.value)}`);
          break;
        case Mapping.Statements.Operator.BETWEEN:
        case Mapping.Statements.Operator.CONTAIN:
        case Mapping.Statements.Operator.NOT_CONTAIN:
          matches.push(`${expression}:${[...operation.value].map(item => encodeURIComponent(item)).join(',')}`);
          break;
      }
    }
    return matches.join(';');
  }

  /**
   * Unpacks the specified match rule string according to the specified model type.
   * @param model Model type.
   * @param match Match string.
   * @returns Returns the generated match entity.
   * @throws @throws Throws an error when there are unsupported orders in the match string.
   */
  @Class.Private()
  private static unpackMatchRule(model: Mapping.Types.Model, match: string): Mapping.Statements.Match {
    const newer = <Mapping.Statements.Match>{};
    const fields = match.split(';');
    for (const field of fields) {
      const [name, operator, value] = field.split(':', 3);
      const code = parseInt(operator);
      const schema = Mapping.Schema.getRealColumn(model, name);
      switch (code) {
        case Mapping.Statements.Operator.REGEX:
        case Mapping.Statements.Operator.LESS:
        case Mapping.Statements.Operator.LESS_OR_EQUAL:
        case Mapping.Statements.Operator.EQUAL:
        case Mapping.Statements.Operator.NOT_EQUAL:
        case Mapping.Statements.Operator.GREATER_OR_EQUAL:
        case Mapping.Statements.Operator.GREATER:
          newer[schema.name] = { operator: code, value: decodeURIComponent(value) };
          break;
        case Mapping.Statements.Operator.BETWEEN:
        case Mapping.Statements.Operator.CONTAIN:
        case Mapping.Statements.Operator.NOT_CONTAIN:
          newer[schema.name] = { operator: code, value: value.split(',').map(value => decodeURIComponent(value)) };
          break;
        default:
          throw new Error(`Match operator code '${code}' doesn't supported.`);
      }
    }
    return newer;
  }

  /**
   * Packs the specified pre-match into the query list according to the given model type.
   * @param model Model type.
   * @param queries Query list.
   * @param match Matching fields.
   */
  @Class.Private()
  private static packPreMatch(model: Mapping.Types.Model, queries: string[], match: Mapping.Statements.Match | Mapping.Statements.Match[]): void {
    const matches = (match instanceof Array ? match : [match]).map((match: Mapping.Statements.Match) => this.packMatchRule(model, match));
    if (matches.length) {
      queries.push(`${this.PreMatchPrefix}/${matches.join('|')}`);
    }
  }

  /**
   * Packs the specified post-match into the query list according to the given model type.
   * @param model Model type.
   * @param queries Query list.
   * @param match Matching fields.
   */
  @Class.Private()
  private static packPostMatch(model: Mapping.Types.Model, queries: string[], match: Mapping.Statements.Match | Mapping.Statements.Match[]): void {
    const matches = (match instanceof Array ? match : [match]).map((match: Mapping.Statements.Match) => this.packMatchRule(model, match));
    if (matches.length) {
      queries.push(`${this.PostMatchPrefix}/${matches.join('|')}`);
    }
  }

  /**
   * Unpacks the specified match string according to the specified model type.
   * @param model Model type.
   * @param match Match string.
   * @returns Returns a single generated match entity or the generated match entity list.
   */
  @Class.Private()
  private static unpackMatch(model: Mapping.Types.Model, match: string): Mapping.Statements.Match | Mapping.Statements.Match[] {
    const newer = <Mapping.Statements.Match[]>[];
    const matches = match.split('|');
    for (const match of matches) {
      newer.push(this.unpackMatchRule(model, match));
    }
    if (newer.length === 1) {
      return newer[0];
    } else {
      return newer;
    }
  }

  /**
   * Packs the specified sort entity according to the specified model type.
   * @param model Model type.
   * @param queries Query list.
   * @param sort Sorting order.
   */
  @Class.Private()
  private static packSort(model: Mapping.Types.Model, queries: string[], sort: Mapping.Statements.Sort): void {
    let parts = [];
    for (const name in sort) {
      const schema = Mapping.Schema.getRealColumn(model, name);
      parts.push(`${schema.name}:${sort[name]}`);
    }
    if (parts.length) {
      queries.push(`${this.SortPrefix}/${parts.join(';')}`);
    }
  }

  /**
   * Unpacks the specified sort string according to the specified model type.
   * @param model Model type.
   * @param sort Sort string.
   * @returns Returns the generated sort entity.
   * @throws Throws an error when there are unsupported orders in the specified sort string.
   */
  @Class.Private()
  private static unpackSort(model: Mapping.Types.Model, sort: string): Mapping.Statements.Sort {
    const newer = <Mapping.Statements.Sort>{};
    const fields = sort.split(';');
    for (const field of fields) {
      const [name, order] = field.split(':', 2);
      const code = parseInt(order);
      const schema = Mapping.Schema.getRealColumn(model, name);
      switch (code) {
        case Mapping.Statements.Order.ASCENDING:
        case Mapping.Statements.Order.DESCENDING:
          newer[schema.name] = code;
          break;
        default:
          throw new Error(`Sorting order code '${code}' doesn't supported.`);
      }
    }
    return newer;
  }

  /**
   * Packs the specified limit entity.
   * @param queries Query list.
   * @param limit Limit entity.
   */
  @Class.Private()
  private static packLimit(queries: string[], limit: Mapping.Statements.Limit): void {
    queries.push(`${this.LimitPrefix}/${limit.start || 0};${limit.count || 0}`);
  }

  /**
   * Unpacks the specified limit string.
   * @param limit Limit string.
   * @returns Returns the generated limit entity.
   */
  @Class.Private()
  private static unpackLimit(limit: string): Mapping.Statements.Limit {
    const [start, count] = limit.split(';', 2);
    return {
      start: parseInt(start),
      count: parseInt(count)
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
  public static toURL(model: Mapping.Types.Model, views: string[], filter?: Mapping.Statements.Filter): string {
    const queries = <string[]>[];
    if (views.length) {
      this.packViews(queries, views);
    }
    if (filter) {
      if (filter.pre) {
        this.packPreMatch(model, queries, filter.pre);
      }
      if (filter.post) {
        this.packPostMatch(model, queries, filter.post);
      }
      if (filter.sort) {
        this.packSort(model, queries, filter.sort);
      }
      if (filter.limit) {
        this.packLimit(queries, filter.limit);
      }
    }
    return queries.length ? `${this.QueryPrefix}/${queries.join('/')}` : ``;
  }

  /**
   * Builds a query entity from the specified query URL.
   * @param model Model type.
   * @param url Query URL.
   * @returns Returns the generated query entity.
   * @throws Throws an error when there are unsupported data in the specified URL.
   */
  @Class.Public()
  public static fromURL(model: Mapping.Types.Model, url: string): Query {
    const result = <Query>{ views: [] };
    const parts = url.split('/').reverse();
    if (parts.pop() === this.QueryPrefix) {
      while (parts.length) {
        const data = parts.pop();
        switch (data) {
          case this.ViewsPrefix:
            result.views = this.unpackViews(<string>parts.pop());
            break;
          case this.PreMatchPrefix:
            result.pre = this.unpackMatch(model, <string>parts.pop());
            break;
          case this.PostMatchPrefix:
            result.post = this.unpackMatch(model, <string>parts.pop());
            break;
          case this.SortPrefix:
            result.sort = this.unpackSort(model, <string>parts.pop());
            break;
          case this.LimitPrefix:
            result.limit = this.unpackLimit(<string>parts.pop());
            break;
          default:
            throw new Error(`Serialized data type '${data}' does not supported.`);
        }
      }
    }
    return result;
  }
}
