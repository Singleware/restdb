/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Response from '../response';
import * as Aliases from '../aliases';

import { Driver as GenericDriver } from '../driver';
import { Filters } from './filters';

/**
 * Common driver class.
 */
@Class.Describe()
export class Driver extends GenericDriver implements Aliases.Driver {
  /**
   * Header name for the counting results.
   */
  @Class.Private()
  private apiCountingHeader = 'x-api-count';

  /**
   * API response error.
   */
  @Class.Private()
  private apiResponseError?: Aliases.Entity;

  /**
   * Gets the request query string based on the specified entity model, fields and filters.
   * @param model Entity model.
   * @param query Query filter.
   * @param fields Viewed fields.
   * @returns Returns the parsed query string.
   */
  @Class.Protected()
  protected parseRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string {
    return Filters.toURL(model, query, fields);
  }

  /**
   * Gets the inserted Id from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the inserted Id or undefined when the inserted Id wasn't found.
   * @throws Throws an error when the response payload doesn't contains the inserted Id.
   */
  @Class.Protected()
  protected parseInsertResponse(model: Aliases.Model, response: Response.Output): string | undefined {
    if (!(response.payload instanceof Object) || (<Aliases.Entity>response.payload).id === void 0) {
      throw new Error(`The response payload must be an object containing the inserted id.`);
    }
    return (<Aliases.Entity>response.payload).id;
  }

  /**
   * Gets the found entity list from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity list.
   * @throws Throws an error when the response payload doesn't contains the entity list.
   */
  @Class.Protected()
  protected parseFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): T[] {
    if (!(response.payload instanceof Array)) {
      throw new Error(`The response payload must be an array containing the search results.`);
    }
    return <T[]>response.payload;
  }

  /**
   * Gets the found entity from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity or undefined when the entity was not found.
   */
  @Class.Protected()
  protected parseFindByIdResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): T | undefined {
    return <T>response.payload;
  }

  /**
   * Gets the number of updated entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of updated entities.
   */
  @Class.Protected()
  protected parseUpdateResponse(model: Aliases.Model, response: Response.Output): number {
    return parseInt(<string>response.headers[this.apiCountingHeader]) || 0;
  }

  /**
   * Gets the updated entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the updated entity status.
   */
  @Class.Protected()
  protected parseUpdateByIdResponse(model: Aliases.Model, response: Response.Output): boolean {
    return true;
  }

  /**
   * Gets the replaced entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the replaced entity status.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseReplaceByIdResponse(model: Aliases.Model, response: Response.Output): boolean {
    return true;
  }

  /**
   * Gets the number of deleted entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of deleted entities.
   */
  @Class.Protected()
  protected parseDeleteResponse(model: Aliases.Model, response: Response.Output): number {
    return parseInt(<string>response.headers[this.apiCountingHeader]) || 0;
  }

  /**
   * Gets the deleted entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the deleted entity status.
   */
  @Class.Protected()
  protected parseDeleteByIdResponse(model: Aliases.Model, response: Response.Output): boolean {
    return true;
  }

  /**
   * Gets the number of entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of entities.
   */
  @Class.Protected()
  protected parseCountResponse(model: Aliases.Model, response: Response.Output): number {
    return parseInt(<string>response.headers[this.apiCountingHeader]) || 0;
  }

  /**
   * Parses the error response from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   */
  @Class.Protected()
  protected parseErrorResponse(mode: Aliases.Model, response: Response.Output): void {
    this.apiResponseError = response.payload;
  }

  /**
   * Sets a new API counting header for the subsequent requests.
   * @param name New header name.
   * @returns Returns the own instance.
   */
  @Class.Protected()
  protected setCountingHeaderName(name: string): Driver {
    this.apiCountingHeader = name.toLowerCase();
    return this;
  }

  /**
   * Gets the last request error response.
   * @returns Returns the error response entity or undefined when there's no error.
   */
  @Class.Protected()
  protected getErrorResponse(): Aliases.Entity | undefined {
    return this.apiResponseError;
  }
}
