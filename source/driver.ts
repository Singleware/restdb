/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Path from '@singleware/path';

import * as Requests from './requests';
import * as Responses from './responses';
import * as Types from './types';

import { Route } from './route';
import { Method } from './method';
import { Headers } from './headers';
import { Options } from './options';

/**
 * Alias type for response result.
 */
type Response<T> = T | Promise<T>;

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
   * API errors subject.
   */
  @Class.Private()
  private apiErrors = new Observable.Subject<Responses.Output>();

  /**
   * Gets the request Id based on the specified entity model and entity Id.
   * @param model Entity model.
   * @param id Entity Id.
   * @returns Returns the request Id.
   */
  @Class.Protected()
  protected getRequestId(model: Types.Model, id: any): string {
    return id.toString();
  }

  /**
   * Gets the request query string based on the specified entity model, fields and filters.
   * @param model Entity model.
   * @param query Query filter.
   * @param fields Viewed fields.
   * @returns Returns the request query string.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getRequestQuery(model: Types.Model, query?: Types.Query, fields?: string[]): string {
    throw new Error(`Method 'getRequestQuery' doesn't implemented.`);
  }

  /**
   * Gets the request method based on the specified entity model.
   * @param model Entity model.
   * @param method Request method.
   * @returns Returns the request method.
   */
  @Class.Protected()
  protected getRequestMethod(model: Types.Model, method: Method): Method {
    return method;
  }

  /**
   * Gets the result Id from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the insert result or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getInsertResponse<R>(model: Types.Model, response: Responses.Output): Response<R> {
    throw new Error(`Method 'getInsertResponse' doesn't implemented.`);
  }

  /**
   * Gets the found entity list from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity list or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getFindResponse<T extends Types.Entity>(model: Types.Model, response: Responses.Output): Response<T[]> {
    throw new Error(`Method 'getFindResponse' doesn't implemented.`);
  }

  /**
   * Gets the found entity from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity, a promise to get it or undefined when the entity wasn't found.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getFindByIdResponse<T extends Types.Entity>(
    model: Types.Model,
    response: Responses.Output
  ): Response<T | undefined> {
    throw new Error(`Method 'getFindByIdResponse' doesn't implemented.`);
  }

  /**
   * Gets the number of updated entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of updated entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getUpdateResponse(model: Types.Model, response: Responses.Output): Response<number> {
    throw new Error(`Method 'getUpdateResponse' doesn't implemented.`);
  }

  /**
   * Gets the updated entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the updated entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getUpdateByIdResponse(model: Types.Model, response: Responses.Output): Response<boolean> {
    throw new Error(`Method 'getUpdateByIdResponse' doesn't implemented.`);
  }

  /**
   * Gets the replaced entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the replaced entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getReplaceByIdResponse(model: Types.Model, response: Responses.Output): Response<boolean> {
    throw new Error(`Method 'getReplaceByIdResponse' doesn't implemented.`);
  }

  /**
   * Gets the number of deleted entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of deleted entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getDeleteResponse(model: Types.Model, response: Responses.Output): Response<number> {
    throw new Error(`Method 'getDeleteResponse' doesn't implemented.`);
  }

  /**
   * Gets the deleted entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the deleted entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getDeleteByIdResponse(model: Types.Model, response: Responses.Output): Response<boolean> {
    throw new Error(`Method 'getDeleteByIdResponse' doesn't implemented.`);
  }

  /**
   * Gets the number of entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getCountResponse(model: Types.Model, response: Responses.Output): Response<number> {
    throw new Error(`Method 'getCountResponse' doesn't implemented.`);
  }

  /**
   * Gets a new request path based on the specified route entity.
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
        return (assigned[variable] = true), value;
      }
      return '';
    });
    if (!assigned.id && route.id !== void 0 && route.id.length > 0) {
      path += `/${route.id}`;
    }
    if (!assigned.query && route.query !== void 0 && route.query.length > 0) {
      path += `/${route.query}`;
    }
    return Path.normalize(path);
  }

  /**
   * Send an HTTP request and gets the response.
   * @param method Request method.
   * @param path Request path.
   * @param payload Request payload.
   * @returns Returns a promise to get the response output.
   */
  @Class.Private()
  private getRequestResponse(method: string, path: string, payload?: Types.Entity): Promise<Responses.Output> {
    const input = <Requests.Input>{
      url: `${this.apiUrl}/${path}`,
      method: method,
      payload: payload,
      headers: { ...this.apiHeaders }
    };
    if (typeof window === typeof void 0) {
      return Requests.Backend.request(input);
    }
    return Requests.Frontend.request(input);
  }

  /**
   * Sets a new request header.
   * @param name Header name.
   * @param value Header value.
   * @returns Returns its own instance.
   */
  @Class.Protected()
  protected setHeader(name: string, value: string | string[]): Driver {
    return (this.apiHeaders[name] = value), this;
  }

  /**
   * Removes the specified header.
   * @param name Header name.
   * @returns Returns its own instance.
   */
  @Class.Protected()
  protected removeHeader(name: string): Driver {
    return delete this.apiHeaders[name], this;
  }

  /**
   * Notify an error in the given response entity for all listeners.
   * @param model Entity model.
   * @param response Response entity.
   */
  @Class.Protected()
  protected async notifyErrorResponse(model: Types.Model, response: Responses.Output): Promise<void> {
    await this.apiErrors.notifyAll(response);
  }

  /**
   * Gets the error subject.
   */
  @Class.Public()
  public get onError(): Observable.Subject<Responses.Output> {
    return this.apiErrors;
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
   * Insert the specified entity using a POST request.
   * @param model Model type.
   * @param entities Entity list.
   * @param options Insert options.
   * @returns Returns a promise to get the insert results.
   * @throws Throws an error when the result payload doesn't contains the insertion id.
   */
  @Class.Public()
  public async insert<T extends Types.Entity, R>(model: Types.Model, entities: T[], options: Options): Promise<R[]> {
    const method = this.getRequestMethod(model, options.method ?? Method.POST);
    const path = this.getRequestPath({
      model: model,
      path: options.path,
      query: this.getRequestQuery(model)
    });
    const list = <R[]>[];
    for (const entity of entities) {
      const payload = Types.Normalizer.create(model, entity, true, true);
      const response = await this.getRequestResponse(method, path, payload);
      if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
        const result = await this.getInsertResponse<R>(model, response);
        if (result !== void 0) {
          list.push(result);
        }
      } else {
        await this.notifyErrorResponse(model, response);
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
   * @throws Throws an error when the result payload isn't an array.
   */
  @Class.Public()
  public async find<T extends Types.Entity>(
    model: Types.Model<T>,
    query: Types.Query,
    fields: string[],
    options: Options
  ): Promise<T[]> {
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.GET),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model, query, fields)
      })
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getFindResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), [];
  }

  /**
   * Find the entity that corresponds to the specified Id using a GET request.
   * @param model Model type.
   * @param id Entity Id.
   * @param fields Viewed fields.
   * @param options Find options.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Types.Entity>(
    model: Types.Model<T>,
    id: any,
    fields: string[],
    options: Options
  ): Promise<T | undefined> {
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.GET),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model, void 0, fields),
        id: this.getRequestId(model, id)
      })
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getFindByIdResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), void 0;
  }

  /**
   * Update all entities that corresponds to the specified matching fields using a PATCH request.
   * @param model Model type.
   * @param match Matching fields.
   * @param entity Entity data.
   * @param options Update options.
   * @returns Returns a promise to get the number of updated entities.
   */
  @Class.Public()
  public async update(model: Types.Model, match: Types.Match, entity: Types.Entity, options: Options): Promise<number> {
    const payload = Types.Normalizer.create(model, entity, true, true);
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.PATCH),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model, { pre: match })
      }),
      payload
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getUpdateResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), 0;
  }

  /**
   * Update the entity that corresponds to the specified Id using a PATCH request.
   * @param model Model type.
   * @param id Entity Id.
   * @param entity Entity data.
   * @param options Update options.
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Types.Model, id: any, entity: Types.Entity, options: Options): Promise<boolean> {
    const payload = Types.Normalizer.create(model, entity, true, true);
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.PATCH),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model),
        id: this.getRequestId(model, id)
      }),
      payload
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getUpdateByIdResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), false;
  }

  /**
   * Replace the entity that corresponds to the specified Id using a PUT request.
   * @param model Model type.
   * @param id Entity Id.
   * @param entity Entity data.
   * @param options Replace options.
   * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
   */
  @Class.Public()
  public async replaceById(model: Types.Model, id: any, entity: Types.Entity, options: Options): Promise<boolean> {
    const payload = Types.Normalizer.create(model, entity, true, true);
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.PUT),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model),
        id: this.getRequestId(model, id)
      }),
      payload
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getReplaceByIdResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), false;
  }

  /**
   * Delete all entities that corresponds to the specified matching fields using a DELETE request.
   * @param model Model type.
   * @param match Matching fields.
   * @param options Delete options.
   * @return Returns a promise to get the number of deleted entities.
   */
  @Class.Public()
  public async delete(model: Types.Model, match: Types.Match, options: Options): Promise<number> {
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.DELETE),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model, { pre: match })
      })
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getDeleteResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), 0;
  }

  /**
   * Delete the entity that corresponds to the specified Id using a DELETE request.
   * @param model Model type.
   * @param id Entity Id.
   * @param options Delete options.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Types.Model, id: any, options: Options): Promise<boolean> {
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.DELETE),
      this.getRequestPath({
        model: model,
        path: options.path,
        id: this.getRequestId(model, id)
      })
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getDeleteByIdResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), false;
  }

  /**
   * Count all corresponding entities using the a HEAD request.
   * @param model Model type.
   * @param query Query filter.
   * @param options Count options.
   * @returns Returns a promise to get the amount of found entities or 0 when there's an error.
   */
  @Class.Public()
  public async count(model: Types.Model, query: Types.Query, options: Options): Promise<number> {
    const response = await this.getRequestResponse(
      this.getRequestMethod(model, options.method ?? Method.HEAD),
      this.getRequestPath({
        model: model,
        path: options.path,
        query: this.getRequestQuery(model, query)
      })
    );
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getCountResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), 0;
  }
}
