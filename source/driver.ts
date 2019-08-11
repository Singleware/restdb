/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Path from '@singleware/path';

import * as Request from './request';
import * as Response from './response';
import * as Aliases from './aliases';

import { Route } from './route';

/**
 * Alias type for parsed response results.
 */
type Parsed<T> = T | Promise<T>;

/**
 * Generic driver class.
 */
@Class.Describe()
export class Driver extends Class.Null implements Aliases.Driver {
  /**
   * Base URL for any endpoint.
   */
  @Class.Private()
  private apiUrl?: string;

  /**
   * Header value for authenticated requests.
   */
  @Class.Private()
  private apiKeyValue?: string;

  /**
   * Header name for authenticated requests.
   */
  @Class.Private()
  private apiKeyHeader = 'x-api-key';

  /**
   * Subject to notify any API error.
   */
  @Class.Private()
  private errorSubject = new Observable.Subject<Response.Output>();

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
        assigned[variable] = true;
        return value;
      }
      return '';
    });
    if (!assigned.id && route.id !== void 0 && route.id.length > 0) {
      path += `/${route.id}`;
    }
    if (!assigned.query && route.query !== void 0 && route.query.length > 0) {
      path += `/${route.query}`;
    }
    return Path.normalize(`${path}`);
  }

  /**
   * Send an HTTP request and gets the response.
   * @param method Request method.
   * @param path Request path.
   * @param payload Request payload.
   * @returns Returns a promise to get the response output.
   */
  @Class.Private()
  private getRequestResponse(method: string, path: string, payload?: Aliases.Entity): Promise<Response.Output> {
    const input = <Request.Input>{
      url: `${this.apiUrl}/${path}`,
      method: method,
      payload: payload
    };
    if (this.apiKeyValue) {
      input.headers = {};
      input.headers[this.apiKeyHeader] = this.apiKeyValue;
    }
    if (typeof window !== 'undefined') {
      return Request.Frontend.request(input);
    }
    return Request.Backend.request(input);
  }

  /**
   * Parses the request Id based on the specified entity model and entity Id.
   * @param model Entity model.
   * @param id Entity Id.
   * @returns Returns the parsed entity Id.
   */
  @Class.Protected()
  protected parseRequestId(model: Aliases.Model, id: any): string {
    return id.toString();
  }

  /**
   * Parses the request query string based on the specified entity model, fields and filters.
   * @param model Entity model.
   * @param query Query filter.
   * @param fields Viewed fields.
   * @returns Returns the parsed query string.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string {
    throw new Error(`Method 'parseRequestQuery' doesn't implemented.`);
  }

  /**
   * Parses the inserted Id from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the inserted Id, a promise to get or undefined when the inserted Id was not found.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseInsertResponse(model: Aliases.Model, response: Response.Output): Parsed<string | undefined> {
    throw new Error(`Method 'parseInsertResponse' doesn't implemented.`);
  }

  /**
   * Parses the found entity list from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity list or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): Parsed<T[]> {
    throw new Error(`Method 'parseFindResponse' doesn't implemented.`);
  }

  /**
   * Parses the found entity from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the entity, a promise to get it or undefined when the entity was not found.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseFindByIdResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): Parsed<T | undefined> {
    throw new Error(`Method 'parseFindByIdResponse' doesn't implemented.`);
  }

  /**
   * Parses the number of updated entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of updated entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseUpdateResponse(model: Aliases.Model, response: Response.Output): Parsed<number> {
    throw new Error(`Method 'parseUpdateResponse' doesn't implemented.`);
  }

  /**
   * Parses the updated entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the updated entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseUpdateByIdResponse(model: Aliases.Model, response: Response.Output): Parsed<boolean> {
    throw new Error(`Method 'parseUpdateByIdResponse' doesn't implemented.`);
  }

  /**
   * Parses the replaced entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the replaced entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseReplaceByIdResponse(model: Aliases.Model, response: Response.Output): Parsed<boolean> {
    throw new Error(`Method 'parseReplaceByIdResponse' doesn't implemented.`);
  }

  /**
   * Parses the number of deleted entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of deleted entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseDeleteResponse(model: Aliases.Model, response: Response.Output): Parsed<number> {
    throw new Error(`Method 'parseDeleteResponse' doesn't implemented.`);
  }

  /**
   * Parses the deleted entity status from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the deleted entity status or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseDeleteByIdResponse(model: Aliases.Model, response: Response.Output): Parsed<boolean> {
    throw new Error(`Method 'parseDeleteByIdResponse' doesn't implemented.`);
  }

  /**
   * Parses the number of entities from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   * @returns Returns the number of entities or a promise to get it.
   * @throws It will always throws an error because it's not implemented yet.
   */
  @Class.Protected()
  protected parseCountResponse(model: Aliases.Model, response: Response.Output): Parsed<number> {
    throw new Error(`Method 'parseCountResponse' doesn't implemented.`);
  }

  /**
   * Parses the error response from the given response entity.
   * @param model Entity model.
   * @param response Response entity.
   */
  @Class.Protected()
  protected parseErrorResponse(model: Aliases.Model, response: Response.Output): void {
    this.errorSubject.notifyAll(response);
  }

  /**
   * Sets a new key header name for the subsequent requests.
   * @param name New header name.
   * @returns Returns the own instance.
   */
  @Class.Protected()
  protected setKeyHeaderName(name: string): Driver {
    this.apiKeyHeader = name;
    return this;
  }

  /**
   * Sets a new key header value for the subsequent requests.
   * @param value New header value.
   * @returns Returns the own instance.
   */
  @Class.Protected()
  protected setKeyHeaderValue(value: string): Driver {
    this.apiKeyValue = value;
    return this;
  }

  /**
   * Sets a new key header name and value for the subsequent requests.
   * @param name New header name.
   * @param value New header value.
   * @returns Returns the own instance.
   */
  @Class.Protected()
  protected setKeyHeader(name: string, value: string): Driver {
    this.apiKeyHeader = name;
    this.apiKeyValue = value;
    return this;
  }

  /**
   * Gets the error subject.
   */
  @Class.Public()
  public get onErrors(): Observable.Subject<Response.Output> {
    return this.errorSubject;
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
    const list = [];
    const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model) });
    for (const entity of entities) {
      const payload = Aliases.Normalizer.create(model, entity, true);
      const response = await this.getRequestResponse('POST', path, payload);
      if (response.status.code === 200 || response.status.code === 201 || response.status.code === 202) {
        const id = await this.parseInsertResponse(model, response);
        if (id !== void 0) {
          list.push(id);
        }
      } else {
        this.parseErrorResponse(model, response);
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
  public async find<T extends Aliases.Entity>(model: Aliases.Model<T>, query: Aliases.Query, fields: string[]): Promise<T[]> {
    const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, query, fields) });
    const response = await this.getRequestResponse('GET', path);
    if (response.status.code === 200) {
      return await this.parseFindResponse(model, response);
    }
    return this.parseErrorResponse(model, response), [];
  }

  /**
   * Find the entity that corresponds to the specified Id using a GET request.
   * @param model Model type.
   * @param id Entity Id.
   * @param fields Viewed fields.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Aliases.Entity>(model: Aliases.Model<T>, id: any, fields: string[]): Promise<T | undefined> {
    const target = this.parseRequestId(model, id);
    const query = this.parseRequestQuery(model, void 0, fields);
    const path = this.getRequestPath({ model: model, id: target, query: query });
    const response = await this.getRequestResponse('GET', path);
    if (response.status.code === 200) {
      return await this.parseFindByIdResponse(model, response);
    }
    return this.parseErrorResponse(model, response), void 0;
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
    const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, { pre: match }) });
    const payload = Aliases.Normalizer.create(model, entity, true);
    const response = await this.getRequestResponse('PATCH', path, payload);
    if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
      return await this.parseUpdateResponse(model, response);
    }
    return this.parseErrorResponse(model, response), 0;
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
    const path = this.getRequestPath({ model: model, id: this.parseRequestId(model, id), query: this.parseRequestQuery(model) });
    const payload = Aliases.Normalizer.create(model, entity, true);
    const response = await this.getRequestResponse('PATCH', path, payload);
    if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
      return await this.parseUpdateByIdResponse(model, response);
    }
    return this.parseErrorResponse(model, response), false;
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
    const path = this.getRequestPath({ model: model, id: this.parseRequestId(model, id), query: this.parseRequestQuery(model) });
    const payload = Aliases.Normalizer.create(model, entity, true);
    const response = await this.getRequestResponse('PUT', path, payload);
    if (response.status.code === 200 || response.status.code === 201 || response.status.code === 202) {
      return await this.parseReplaceByIdResponse(model, response);
    }
    return this.parseErrorResponse(model, response), false;
  }

  /**
   * Delete all entities that corresponds to the specified matching fields using a DELETE request.
   * @param model Model type.
   * @param match Matching fields.
   * @return Returns a promise to get the number of deleted entities.
   */
  @Class.Public()
  public async delete(model: Aliases.Model, match: Aliases.Match): Promise<number> {
    const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, { pre: match }) });
    const response = await this.getRequestResponse('DELETE', path);
    if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
      return await this.parseDeleteResponse(model, response);
    }
    return this.parseErrorResponse(model, response), 0;
  }

  /**
   * Delete the entity that corresponds to the specified Id using a DELETE request.
   * @param model Model type.
   * @param id Entity Id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Aliases.Model, id: any): Promise<boolean> {
    const path = this.getRequestPath({ model: model, id: this.parseRequestId(model, id) });
    const response = await this.getRequestResponse('DELETE', path);
    if (response.status.code === 200 || response.status.code === 202 || response.status.code === 204) {
      return await this.parseDeleteByIdResponse(model, response);
    }
    return this.parseErrorResponse(model, response), false;
  }

  /**
   * Count all corresponding entities using the a HEAD request.
   * @param model Model type.
   * @param query Query filter.
   * @returns Returns a promise to get the total amount of found entities.
   */
  @Class.Public()
  public async count(model: Aliases.Model, query: Aliases.Query): Promise<number> {
    const path = this.getRequestPath({ model: model, query: this.parseRequestQuery(model, query) });
    const response = await this.getRequestResponse('HEAD', path);
    if (response.status.code === 200 || response.status.code === 204) {
      return await this.parseCountResponse(model, response);
    }
    return this.parseErrorResponse(model, response), 0;
  }
}
