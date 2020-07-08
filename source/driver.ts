/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Path from '@singleware/path';

import * as Requests from './requests';
import * as Responses from './responses';
import * as Types from './types';

import { Route } from './route';
import { Method } from './method';
import { Headers } from './headers';
import { Options } from './options';

/**
 * Generic driver class.
 */
@Class.Describe()
export class Driver extends Class.Null implements Types.Driver {
  /**
   * API base endpoint.
   */
  @Class.Private()
  private apiUrl?: string;

  /**
   * API base headers.
   */
  @Class.Private()
  private apiHeaders = <Headers>{};

  /**
   * API auth headers.
   */
  @Class.Private()
  private apiAuthHeaders = <Headers>{};

  /**
   * Get the insert result from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the insert result or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getInsertResponse<T>(model: Types.Model, response: Responses.Output): never | T | Promise<T | undefined> | undefined {
    throw new Error(`Method 'getInsertResponse' isn't implemented.`);
  }

  /**
   * Get the found entity list from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity list or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getFindResponse<T>(model: Types.Model, response: Responses.Output): never | T[] | Promise<T[]> {
    throw new Error(`Method 'getFindResponse' isn't implemented.`);
  }

  /**
   * Get the found entity from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity, a promise to get it or undefined when the entity wasn't found.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getFindByIdResponse<T>(model: Types.Model, response: Responses.Output): never | T | Promise<T | undefined> | undefined {
    throw new Error(`Method 'getFindByIdResponse' isn't implemented.`);
  }

  /**
   * Get the number of updated entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of updated entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getUpdateResponse<T>(model: Types.Model, response: Responses.Output): never | number {
    throw new Error(`Method 'getUpdateResponse' isn't implemented.`);
  }

  /**
   * Get the updated entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the updated entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getUpdateByIdResponse<T>(model: Types.Model, response: Responses.Output): never | boolean {
    throw new Error(`Method 'getUpdateByIdResponse' isn't implemented.`);
  }

  /**
   * Get the replaced entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the replaced entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getReplaceByIdResponse<T>(model: Types.Model, response: Responses.Output): never | boolean {
    throw new Error(`Method 'getReplaceByIdResponse' isn't implemented.`);
  }

  /**
   * Get the number of deleted entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of deleted entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getDeleteResponse<T>(model: Types.Model, response: Responses.Output): never | number {
    throw new Error(`Method 'getDeleteResponse' isn't implemented.`);
  }

  /**
   * Get the deleted entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the deleted entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getDeleteByIdResponse<T>(model: Types.Model, response: Responses.Output): never | boolean {
    throw new Error(`Method 'getDeleteByIdResponse' isn't implemented.`);
  }

  /**
   * Get the number of entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getCountResponse<T>(model: Types.Model, response: Responses.Output): never | number {
    throw new Error(`Method 'getCountResponse' isn't implemented.`);
  }

  /**
   * Get the request query string based on the specified entity model, filters and fields.
   * @param model Entity model.
   * @param query Query filter.
   * @param fields Fields to select.
   * @returns Returns the request query string.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getRequestQuery(model: Types.Model, query?: Types.Query, fields?: string[]): never | string {
    throw new Error(`Method 'getRequestQuery' isn't implemented.`);
  }

  /**
   * Get the request Id based on the specified entity model and entity Id.
   * @param model Entity model.
   * @param id Entity Id.
   * @returns Returns the request Id.
   */
  @Class.Protected()
  protected getRequestId(model: Types.Model, id: any): string {
    return id.toString();
  }

  /**
   * Get a new request path based on the specified route entity.
   * @param route Route entity.
   * @returns Returns the generated request path.
   */
  @Class.Private()
  private getRequestPath(route: Route): string {
    const assigned = <Types.Entity>{};
    const endpoint = route.path ?? Types.Schema.getStorageName(route.model);
    let path = endpoint.replace(/{query}|{id}/gi, (match: string) => {
      const variable = match.substr(1, match.length - 2);
      const value = (<Types.Entity>route)[variable];
      if (value !== void 0) {
        assigned[variable] = true;
        return value;
      }
      return '';
    });
    if (!assigned.id && route.id) {
      path += `/${route.id}`;
    }
    if (!assigned.query && route.query) {
      path += `/${route.query}`;
    }
    return `${this.apiUrl}/${Path.normalize(path)}`;
  }

  /**
   * Send an HTTP request and gets the response.
   * @param method Request method.
   * @param path Request path.
   * @param auth Determines whether or not authentication is required.
   * @param payload Request payload.
   * @returns Returns a promise to get the response output.
   */
  @Class.Private()
  private getRequestResponse(method: string, path: string, auth?: boolean, payload?: Types.Entity): Promise<Responses.Output> {
    const input = <Requests.Input>{
      payload: payload,
      method: method,
      url: path,
      headers: {
        ...(auth !== false ? this.apiAuthHeaders : void 0),
        ...this.apiHeaders
      }
    };
    if (typeof window === typeof void 0) {
      return Requests.Backend.request(input);
    }
    return Requests.Frontend.request(input);
  }

  /**
   * Set a new authentication header.
   * @param name Header name.
   * @param value Header value.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  protected setAuthHeader(name: string, value: string | string[]): Driver {
    this.apiAuthHeaders[name] = value;
    return this;
  }

  /**
   * Unset the specified authentication header.
   * @param name Header name.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  protected unsetAuthHeader(name: string): Driver {
    delete this.apiAuthHeaders[name];
    return this;
  }

  /**
   * Connect to the API.
   * @param url Api URL.
   */
  @Class.Public()
  public async connect(url: string): Promise<void> {
    this.apiUrl = url;
  }

  /**
   * Sets a new request header.
   * @param name Header name.
   * @param value Header value.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  public setHeader(name: string, value: string | string[]): Driver {
    this.apiHeaders[name] = value;
    return this;
  }

  /**
   * Unset the specified header.
   * @param name Header name.
   * @returns Returns the instance itself.
   */
  @Class.Protected()
  public unsetHeader(name: string): Driver {
    delete this.apiHeaders[name];
    return this;
  }

  /**
   * Request data from the API using the given details.
   * @param details Request details.
   * @returns Returns a promise to get the payload data.
   * @throws Throws an error when the status code isn't acceptable.
   */
  @Class.Public()
  public async request(path: string, options: Omit<Options, 'path'>, payload?: Types.Entity): Promise<Responses.Output> {
    const response = await this.getRequestResponse(options.method ?? Method.GET, path, options.auth, payload);
    if (!Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      throw new Error(`${response.status.code} ${response.status.message}`);
    }
    return response;
  }

  /**
   * Insert the specified entity using a POST request.
   * @param model Model type.
   * @param entities Entity list.
   * @param options Insert options.
   * @returns Returns a promise to get the insert results.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async insert<T extends Types.Entity, R>(model: Types.Model, entities: T[], options: Options): Promise<R[]> {
    const path = this.getRequestPath({
      query: this.getRequestQuery(model),
      path: options.path,
      model: model
    });
    const list = <R[]>[];
    for (const entity of entities) {
      const payload = Types.Normalizer.create(model, entity, true, true);
      const response = await this.getInsertResponse(
        model,
        await this.request(
          path,
          {
            method: Method.POST,
            ...options
          },
          payload
        )
      );
      if (response !== void 0) {
        list.push(<R>response);
      }
    }
    return list;
  }

  /**
   * Search for all entities that corresponds to the specified filter using a GET request.
   * @param model Model type.
   * @param query Query filter.
   * @param fields Viewed fields.
   * @param options Find options.
   * @returns Returns a promise to get the list of found entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async find<T extends Types.Entity>(
    model: Types.Model<T>,
    query: Types.Query,
    fields: string[],
    options: Options
  ): Promise<T[]> {
    const path = this.getRequestPath({
      query: this.getRequestQuery(model, query, fields),
      path: options.path,
      model: model
    });
    return this.getFindResponse(
      model,
      await this.request(path, {
        method: Method.GET,
        ...options
      })
    );
  }

  /**
   * Find the entity that corresponds to the specified Id using a GET request.
   * @param model Model type.
   * @param id Entity Id.
   * @param fields Viewed fields.
   * @param options Find options.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async findById<T extends Types.Entity>(
    model: Types.Model<T>,
    id: any,
    fields: string[],
    options: Options
  ): Promise<T | undefined> {
    const path = this.getRequestPath({
      id: this.getRequestId(model, id),
      query: this.getRequestQuery(model, void 0, fields),
      path: options.path,
      model: model
    });
    return this.getFindByIdResponse(
      model,
      await this.request(path, {
        method: Method.GET,
        ...options
      })
    );
  }

  /**
   * Update all entities that corresponds to the specified matching fields using a PATCH request.
   * @param model Model type.
   * @param match Matching fields.
   * @param entity Entity data.
   * @param options Update options.
   * @returns Returns a promise to get the number of updated entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async update(model: Types.Model, match: Types.Match, entity: Types.Entity, options: Options): Promise<number> {
    const payload = Types.Normalizer.create(model, entity, true, true);
    const path = this.getRequestPath({
      query: this.getRequestQuery(model, { pre: match }),
      path: options.path,
      model: model
    });
    return this.getUpdateResponse(
      model,
      await this.request(
        path,
        {
          method: Method.PATCH,
          ...options
        },
        payload
      )
    );
  }

  /**
   * Update the entity that corresponds to the specified Id using a PATCH request.
   * @param model Model type.
   * @param id Entity Id.
   * @param entity Entity data.
   * @param options Update options.
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async updateById(model: Types.Model, id: any, entity: Types.Entity, options: Options): Promise<boolean> {
    const payload = Types.Normalizer.create(model, entity, true, true);
    const path = this.getRequestPath({
      id: this.getRequestId(model, id),
      query: this.getRequestQuery(model),
      path: options.path,
      model: model
    });
    return this.getUpdateByIdResponse(
      model,
      await this.request(
        path,
        {
          method: Method.PATCH,
          ...options
        },
        payload
      )
    );
  }

  /**
   * Replace the entity that corresponds to the specified Id using a PUT request.
   * @param model Model type.
   * @param id Entity Id.
   * @param entity Entity data.
   * @param options Replace options.
   * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async replaceById(model: Types.Model, id: any, entity: Types.Entity, options: Options): Promise<boolean> {
    const payload = Types.Normalizer.create(model, entity, true, true);
    const path = this.getRequestPath({
      id: this.getRequestId(model, id),
      query: this.getRequestQuery(model),
      path: options.path,
      model: model
    });
    return this.getReplaceByIdResponse(
      model,
      await this.request(
        path,
        {
          method: Method.PUT,
          ...options
        },
        payload
      )
    );
  }

  /**
   * Delete all entities that corresponds to the specified matching fields using a DELETE request.
   * @param model Model type.
   * @param match Matching fields.
   * @param options Delete options.
   * @return Returns a promise to get the number of deleted entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async delete(model: Types.Model, match: Types.Match, options: Options): Promise<number> {
    const path = this.getRequestPath({
      query: this.getRequestQuery(model, { pre: match }),
      path: options.path,
      model: model
    });
    return this.getDeleteResponse(
      model,
      await this.request(path, {
        method: Method.DELETE,
        ...options
      })
    );
  }

  /**
   * Delete the entity that corresponds to the specified Id using a DELETE request.
   * @param model Model type.
   * @param id Entity Id.
   * @param options Delete options.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async deleteById(model: Types.Model, id: any, options: Options): Promise<boolean> {
    const path = this.getRequestPath({
      id: this.getRequestId(model, id),
      path: options.path,
      model: model
    });
    return this.getDeleteByIdResponse(
      model,
      await this.request(path, {
        method: Method.DELETE,
        ...options
      })
    );
  }

  /**
   * Count all corresponding entities using the a HEAD request.
   * @param model Model type.
   * @param query Query filter.
   * @param options Count options.
   * @returns Returns a promise to get the amount of entities.
   * @throws Throws an error when the server response is invalid.
   */
  @Class.Public()
  public async count(model: Types.Model, query: Types.Query, options: Options): Promise<number> {
    const path = this.getRequestPath({
      query: this.getRequestQuery(model, query),
      path: options.path,
      model: model
    });
    return this.getCountResponse(
      model,
      await this.request(path, {
        method: Method.HEAD,
        ...options
      })
    );
  }
}
