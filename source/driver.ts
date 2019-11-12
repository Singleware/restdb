/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Path from '@singleware/path';

import * as Requests from './requests';
import * as Responses from './responses';
import * as Aliases from './aliases';

import { Route } from './route';
import { Method } from './method';
import { Headers } from './headers';

/**
 * Alias type for response result.
 */
type Response<T> = T | Promise<T>;

/**
 * Generic driver class.
 */
@Class.Describe()
export class Driver extends Class.Null implements Aliases.Driver {
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
  protected getRequestId(model: Aliases.Model, id: any): string {
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
  protected getRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string {
    throw new Error(`Method 'getRequestQuery' doesn't implemented.`);
  }

  /**
   * Gets the request method based on the specified entity model.
   * @param model Entity model.
   * @param method Request method.
   * @returns Returns the request method.
   */
  @Class.Protected()
  protected getRequestMethod(model: Aliases.Model, method: Method): Method {
    return method;
  }

  /**
   * Gets the result Id from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the result Id, a promise to get it or undefined when the result Id wasn't found.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected getInsertResponse(model: Aliases.Model, response: Responses.Output): Response<string | undefined> {
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
  protected getFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Responses.Output): Response<T[]> {
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
  protected getFindByIdResponse<T extends Aliases.Entity>(
    model: Aliases.Model,
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
  protected getUpdateResponse(model: Aliases.Model, response: Responses.Output): Response<number> {
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
  protected getUpdateByIdResponse(model: Aliases.Model, response: Responses.Output): Response<boolean> {
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
  protected getReplaceByIdResponse(model: Aliases.Model, response: Responses.Output): Response<boolean> {
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
  protected getDeleteResponse(model: Aliases.Model, response: Responses.Output): Response<number> {
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
  protected getDeleteByIdResponse(model: Aliases.Model, response: Responses.Output): Response<boolean> {
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
  protected getCountResponse(model: Aliases.Model, response: Responses.Output): Response<number> {
    throw new Error(`Method 'getCountResponse' doesn't implemented.`);
  }

  /**
   * Gets a new request path based on the specified route entity.
   * @param route Route entity.
   * @returns Returns the generated request path.
   */
  @Class.Private()
  private getRequestPath(route: Route): string {
    const assigned = <Aliases.Entity>{};
    const endpoint = Aliases.Schema.getStorageName(route.model);
    let path = endpoint.replace(/{query}|{id}/gi, (match: string) => {
      const variable = match.substr(1, match.length - 2);
      const value = (<Aliases.Entity>route)[variable];
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
  private getRequestResponse(method: string, path: string, payload?: Aliases.Entity): Promise<Responses.Output> {
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
  protected async notifyErrorResponse(model: Aliases.Model, response: Responses.Output): Promise<void> {
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
   * @returns Returns a promise to get the id list of all inserted entities.
   * @throws Throws an error when the result payload doesn't contains the insertion id.
   */
  @Class.Public()
  public async insert<T extends Aliases.Entity>(model: Aliases.Model, entities: T[]): Promise<string[]> {
    const path = this.getRequestPath({ model: model, query: this.getRequestQuery(model) });
    const method = this.getRequestMethod(model, Method.POST);
    const list = [];
    for (const entity of entities) {
      const payload = Aliases.Normalizer.create(model, entity, true, true);
      const response = await this.getRequestResponse(method, path, payload);
      if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
        const identity = await this.getInsertResponse(model, response);
        if (identity !== void 0) {
          list.push(identity);
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
   * @returns Returns a promise to get the list of found entities.
   * @throws Throws an error when the result payload isn't an array.
   */
  @Class.Public()
  public async find<T extends Aliases.Entity>(
    model: Aliases.Model<T>,
    query: Aliases.Query,
    fields: string[]
  ): Promise<T[]> {
    const path = this.getRequestPath({ model: model, query: this.getRequestQuery(model, query, fields) });
    const method = this.getRequestMethod(model, Method.GET);
    const response = await this.getRequestResponse(method, path);
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
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Aliases.Entity>(
    model: Aliases.Model<T>,
    id: any,
    fields: string[]
  ): Promise<T | undefined> {
    const query = this.getRequestQuery(model, void 0, fields);
    const path = this.getRequestPath({ model: model, id: this.getRequestId(model, id), query: query });
    const method = this.getRequestMethod(model, Method.GET);
    const response = await this.getRequestResponse(method, path);
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
   * @returns Returns a promise to get the number of updated entities.
   */
  @Class.Public()
  public async update(model: Aliases.Model, match: Aliases.Match, entity: Aliases.Entity): Promise<number> {
    const path = this.getRequestPath({ model: model, query: this.getRequestQuery(model, { pre: match }) });
    const method = this.getRequestMethod(model, Method.PATCH);
    const payload = Aliases.Normalizer.create(model, entity, true, true);
    const response = await this.getRequestResponse(method, path, payload);
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
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Aliases.Model, id: any, entity: Aliases.Entity): Promise<boolean> {
    const path = this.getRequestPath({ model: model, id: this.getRequestId(model, id), query: this.getRequestQuery(model) });
    const method = this.getRequestMethod(model, Method.PATCH);
    const payload = Aliases.Normalizer.create(model, entity, true, true);
    const response = await this.getRequestResponse(method, path, payload);
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
   * @returns Returns a promise to get the true when the entity has been replaced or false otherwise.
   */
  @Class.Public()
  public async replaceById(model: Aliases.Model, id: any, entity: Aliases.Entity): Promise<boolean> {
    const path = this.getRequestPath({ model: model, id: this.getRequestId(model, id), query: this.getRequestQuery(model) });
    const method = this.getRequestMethod(model, Method.PUT);
    const payload = Aliases.Normalizer.create(model, entity, true, true);
    const response = await this.getRequestResponse(method, path, payload);
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getReplaceByIdResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), false;
  }

  /**
   * Delete all entities that corresponds to the specified matching fields using a DELETE request.
   * @param model Model type.
   * @param match Matching fields.
   * @return Returns a promise to get the number of deleted entities.
   */
  @Class.Public()
  public async delete(model: Aliases.Model, match: Aliases.Match): Promise<number> {
    const path = this.getRequestPath({ model: model, query: this.getRequestQuery(model, { pre: match }) });
    const method = this.getRequestMethod(model, Method.DELETE);
    const response = await this.getRequestResponse(method, path);
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getDeleteResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), 0;
  }

  /**
   * Delete the entity that corresponds to the specified Id using a DELETE request.
   * @param model Model type.
   * @param id Entity Id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Aliases.Model, id: any): Promise<boolean> {
    const path = this.getRequestPath({ model: model, id: this.getRequestId(model, id) });
    const method = this.getRequestMethod(model, Method.DELETE);
    const response = await this.getRequestResponse(method, path);
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getDeleteByIdResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), false;
  }

  /**
   * Count all corresponding entities using the a HEAD request.
   * @param model Model type.
   * @param query Query filter.
   * @returns Returns a promise to get the amount of found entities or 0 when there's an error.
   */
  @Class.Public()
  public async count(model: Aliases.Model, query: Aliases.Query): Promise<number> {
    const path = this.getRequestPath({ model: model, query: this.getRequestQuery(model, query) });
    const method = this.getRequestMethod(model, Method.HEAD);
    const response = await this.getRequestResponse(method, path);
    if (Requests.Helper.isAcceptedStatusCode(response.status.code)) {
      return await this.getCountResponse(model, response);
    }
    return await this.notifyErrorResponse(model, response), 0;
  }
}
