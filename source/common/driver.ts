/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Responses from '../responses';
import * as Types from '../types';

import { Driver as GenericDriver } from '../driver';
import { Filters } from './filters';

/**
 * Common driver class.
 */
@Class.Describe()
export class Driver extends GenericDriver implements Types.Driver {
  /**
   * Header name for the authorization key.
   */
  @Class.Private()
  private apiKeyHeader = 'x-api-key';

  /**
   * Header name for the counting results.
   */
  @Class.Private()
  private apiCountingHeader = 'x-api-count';

  /**
   * API response error.
   */
  @Class.Private()
  private apiResponseError?: Types.Entity;

  /**
   * Gets the request query string based on the specified entity model, fields and filters.
   * @param model Entity model.
   * @param query Query filter.
   * @param fields Viewed fields.
   * @returns Returns the parsed query string.
   */
  @Class.Protected()
  protected getRequestQuery(model: Types.Model, query?: Types.Query, fields?: string[]): string {
    return Filters.toURL(model, query, fields);
  }

  /**
   * Gets the result Id from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the result Id or undefined when the result Id wasn't found.
   * @throws Throws an error when the response payload doesn't contains the result Id.
   */
  @Class.Protected()
  protected getInsertResponse(model: Types.Model, response: Responses.Output): string | undefined {
    if (response.status.code === 200 || response.status.code === 201 || response.status.code === 202) {
      if (!(response.payload instanceof Object) || (<Types.Entity>response.payload).id === void 0) {
        throw new Error(`The response payload must be an object containing the insert id.`);
      }
      return (<Types.Entity>response.payload).id;
    }
    return void 0;
  }

  /**
   * Gets the found entity list from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity list.
   * @throws Throws an error when the response payload doesn't contains the entity list.
   */
  @Class.Protected()
  protected getFindResponse<T extends Types.Entity>(model: Types.Model, response: Responses.Output): T[] {
    if (response.status.code === 200) {
      if (!(response.payload instanceof Array)) {
        throw new Error(`The response payload must be an array containing the search results.`);
      }
      return <T[]>response.payload;
    }
    return [];
  }

  /**
   * Gets the found entity from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity or undefined when the entity was not found.
   */
  @Class.Protected()
  protected getFindByIdResponse<T extends Types.Entity>(model: Types.Model, response: Responses.Output): T | undefined {
    if (response.status.code === 200) {
      if (!(response.payload instanceof Object)) {
        throw new Error(`The response payload must be an object.`);
      }
      return <T>response.payload;
    }
    return void 0;
  }

  /**
   * Gets the number of updated entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of updated entities.
   * @throws Throws an error when the counting header is missing or incorrect in the response.
   */
  @Class.Protected()
  protected getUpdateResponse(model: Types.Model, response: Responses.Output): number {
    if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
      const amount = parseInt(<string>response.headers[this.apiCountingHeader]);
      if (isNaN(amount)) {
        throw new Error(`Counting header is missing or incorrect in the update response.`);
      }
      return amount;
    }
    return 0;
  }

  /**
   * Gets the updated entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the updated entity status.
   */
  @Class.Protected()
  protected getUpdateByIdResponse(model: Types.Model, response: Responses.Output): boolean {
    return response.status.code === 200 || response.status.code === 202 || response.status.code === 204;
  }

  /**
   * Gets the replaced entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the replaced entity status.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getReplaceByIdResponse(model: Types.Model, response: Responses.Output): boolean {
    return response.status.code === 200 || response.status.code === 202 || response.status.code === 204;
  }

  /**
   * Gets the number of deleted entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of deleted entities.
   * @throws Throws an error when the counting header is missing or incorrect in the response.
   */
  @Class.Protected()
  protected getDeleteResponse(model: Types.Model, response: Responses.Output): number {
    if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
      const amount = parseInt(<string>response.headers[this.apiCountingHeader]);
      if (isNaN(amount)) {
        throw new Error(`Counting header is missing or incorrect in the delete response.`);
      }
      return amount;
    }
    return 0;
  }

  /**
   * Gets the deleted entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the deleted entity status.
   */
  @Class.Protected()
  protected getDeleteByIdResponse(model: Types.Model, response: Responses.Output): boolean {
    return response.status.code === 200 || response.status.code === 202 || response.status.code === 204;
  }

  /**
   * Gets the number of entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of entities.
   * @throws Throws an error when the counting header is missing or incorrect in the response.
   */
  @Class.Protected()
  protected getCountResponse(model: Types.Model, response: Responses.Output): number {
    if (response.status.code === 200 || response.status.code === 204) {
      const amount = parseInt(<string>response.headers[this.apiCountingHeader]);
      if (isNaN(amount)) {
        throw new Error(`Counting header missing or incorrect in the count response.`);
      }
      return amount;
    }
    return 0;
  }

  /**
   * Notify an error in the given response entity for all listeners.
   * @param model Entity model.
   * @param response Response entity.
   */
  @Class.Protected()
  protected async notifyErrorResponse(model: Types.Model, response: Responses.Output): Promise<void> {
    await super.notifyErrorResponse(model, (this.apiResponseError = response.payload));
  }

  /**
   * Sets a new name for the API counting header.
   * @param name New header name.
   * @returns Returns its own instance.
   */
  @Class.Protected()
  protected setCountingHeaderName(name: string): Driver {
    return (this.apiCountingHeader = name.toLowerCase()), this;
  }

  /**
   * Sets a new name for the API key header.
   * @param name New header name.
   * @returns Returns its own instance.
   */
  @Class.Protected()
  protected setKeyHeaderName(name: string): Driver {
    return (this.apiKeyHeader = name.toLowerCase()), this;
  }

  /**
   * Sets a new value for the API key header.
   * @param value New header value.
   * @returns Returns its own instance.
   */
  @Class.Protected()
  protected setKeyHeaderValue(value: string): Driver {
    return this.setHeader(this.apiKeyHeader, value), this;
  }

  /**
   * Gets the request error response.
   * @returns Returns the error response entity or undefined when there's no error.
   */
  @Class.Protected()
  protected get errorResponse(): Types.Entity | undefined {
    return this.apiResponseError;
  }
}
