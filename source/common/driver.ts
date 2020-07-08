/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
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
   * Last request payload.
   */
  @Class.Private()
  private lastPayload?: Types.Entity | Types.Entity[];

  /**
   * Get the insert result from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the insert result.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Protected()
  protected getInsertResponse<T>(model: Types.Model, response: Responses.Output): T {
    this.lastPayload = response.payload;
    if (response.status.code !== 200 && response.status.code !== 201) {
      throw new Error(`Unexpected insert(${response.input.method}) response status: ${response.status.code}`);
    } else if (this.lastPayload instanceof Array) {
      throw new Error(`Response payload must be an object.`);
    } else if (!(this.lastPayload instanceof Object) || this.lastPayload.id === void 0) {
      throw new Error(`Response payload must contains the Id property.`);
    }
    return this.lastPayload.id;
  }

  /**
   * Get the found entity list from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity list.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Protected()
  protected getFindResponse<T>(model: Types.Model, response: Responses.Output): T[] {
    this.lastPayload = response.payload;
    if (response.status.code !== 200) {
      throw new Error(`Unexpected find(${response.input.method}) response status: ${response.status.code}`);
    } else if (!(this.lastPayload instanceof Array)) {
      throw new Error(`Response payload must contains an array.`);
    }
    return <T[]>this.lastPayload;
  }

  /**
   * Get the found entity from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity or undefined when the entity wasn't found.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Protected()
  protected getFindByIdResponse<T>(model: Types.Model, response: Responses.Output): T | undefined {
    this.lastPayload = response.payload;
    if (response.status.code !== 200) {
      throw new Error(`Unexpected find(${response.input.method}) response status: ${response.status.code}`);
    }
    return <T>this.lastPayload;
  }

  /**
   * Get the number of updated entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of updated entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Protected()
  protected getUpdateResponse(model: Types.Model, response: Responses.Output): number {
    this.lastPayload = response.payload;
    if (response.status.code !== 200) {
      throw new Error(`Unexpected update(${response.input.method}) response status: ${response.status.code}`);
    } else {
      const amount = parseInt(<string>response.headers[this.apiCountingHeader]);
      if (isNaN(amount)) {
        throw new Error(`Response header '${this.apiCountingHeader}' is missing or incorrect.`);
      }
      return amount;
    }
  }

  /**
   * Get the updated entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the updated entity status.
   */
  @Class.Protected()
  protected getUpdateByIdResponse(model: Types.Model, response: Responses.Output): boolean {
    this.lastPayload = response.payload;
    return response.status.code === 200 || response.status.code === 204;
  }

  /**
   * Get the replaced entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the replaced entity status.
   */
  @Class.Protected()
  protected getReplaceByIdResponse(model: Types.Model, response: Responses.Output): boolean {
    this.lastPayload = response.payload;
    return response.status.code === 200 || response.status.code === 204;
  }

  /**
   * Get the number of deleted entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of deleted entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Protected()
  protected getDeleteResponse(model: Types.Model, response: Responses.Output): number {
    this.lastPayload = response.payload;
    if (response.status.code !== 200 && response.status.code !== 204) {
      throw new Error(`Unexpected delete(${response.input.method}) response status: ${response.status.code}`);
    } else {
      const amount = parseInt(<string>response.headers[this.apiCountingHeader]);
      if (isNaN(amount)) {
        throw new Error(`Response header '${this.apiCountingHeader}' is missing or incorrect.`);
      }
      return amount;
    }
  }

  /**
   * Get the deleted entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the deleted entity status.
   */
  @Class.Protected()
  protected getDeleteByIdResponse(model: Types.Model, response: Responses.Output): boolean {
    this.lastPayload = response.payload;
    return response.status.code === 200 || response.status.code === 204;
  }

  /**
   * Get the number of entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Protected()
  protected getCountResponse(model: Types.Model, response: Responses.Output): number {
    this.lastPayload = response.payload;
    if (response.status.code !== 200 && response.status.code !== 204) {
      throw new Error(`Unexpected count(${response.input.method}) response status: ${response.status.code}`);
    } else {
      const amount = parseInt(<string>response.headers[this.apiCountingHeader]);
      if (isNaN(amount)) {
        throw new Error(`Response header '${this.apiCountingHeader}' missing or incorrect.`);
      }
      return amount;
    }
  }

  /**
   * Get the request query string based on the specified entity model, filters and fields.
   * @param model Entity model.
   * @param query Query filter.
   * @param fields Fields to select.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  protected getRequestQuery(model: Types.Model, query?: Types.Query, fields?: string[]): string {
    return Filters.toURL(model, query, fields);
  }

  /**
   * Set a new name for the API counting header.
   * @param name New header name.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  protected setCountingHeaderName(name: string): Driver {
    this.apiCountingHeader = name.toLowerCase();
    return this;
  }

  /**
   * Set a new name for the API key header.
   * @param name New header name.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  protected setKeyHeaderName(name: string): Driver {
    this.unsetAuthHeader(this.apiKeyHeader);
    this.apiKeyHeader = name.toLowerCase();
    return this;
  }

  /**
   * Set a new value for the API key header.
   * @param value New header value.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  protected setKeyHeaderValue(value: string): Driver {
    this.setAuthHeader(this.apiKeyHeader, value);
    return this;
  }

  /**
   * Get the last request payload.
   */
  @Class.Public()
  public get payload(): Types.Entity | Types.Entity[] | undefined {
    return this.lastPayload;
  }
}
