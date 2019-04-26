/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Mapping from '@singleware/mapping';
import * as Path from '@singleware/path';

import * as Request from './request';
import * as Response from './response';

import { Filters } from './filters';
import { Headers } from './headers';
import { Entity } from './entity';
import { Route } from './route';

/**
 * Data driver class.
 */
@Class.Describe()
export class Driver extends Class.Null implements Mapping.Driver {
  /**
   * URL base for any endpoint.
   */
  @Class.Private()
  private apiUrl?: string;

  /**
   * Key for authenticated requests.
   */
  @Class.Private()
  private apiKey?: string;

  /**
   * Header name for the authentication key.
   */
  @Class.Private()
  private apiKeyHeader = 'X-API-Key';

  /**
   * Header name for the counting results.
   */
  @Class.Private()
  private apiCountHeader = 'X-API-Count';

  /**
   * Last error response.
   */
  @Class.Private()
  private errorResponse?: Response.Output;

  /**
   * Subject to notify any API error.
   */
  @Class.Private()
  private errorSubject = new Observable.Subject<Response.Output>();

  /**
   * Send an HTTP request.
   * @param method Request method.
   * @param path Request path.
   * @param content Request content.
   * @returns Returns a promise to get the response output.
   */
  @Class.Private()
  private request(method: string, path: string, content?: Mapping.Types.Entity): Promise<Response.Output> {
    const input = {
      url: `${this.apiUrl}${path}`,
      method: method,
      content: content ? Entity.extractMap(content) : void 0,
      headers: <Headers>{}
    };
    if (this.apiKey) {
      input.headers[this.apiKeyHeader] = this.apiKey;
    }
    return window !== void 0 ? Request.Frontend.request(input) : Request.Backend.request(input);
  }

  /**
   * Gets a new request path based on the specified route entity.
   * @param route Route entity.
   * @returns Returns the generated request path.
   */
  @Class.Private()
  private getPath(route: Route): string {
    const assigned = <Mapping.Types.Entity>{};
    const path = Mapping.Schema.getStorage(route.model).replace(/{query}|{id}/g, (match: string) => {
      const name = match.substr(1, match.length - 2);
      const variable = (<Mapping.Types.Entity>route)[name];
      return variable !== void 0 ? ((assigned[name] = true), variable) : '';
    });
    if (!assigned.id && route.id !== void 0 && route.id.length > 0) {
      return Path.normalize(`/${path}/${route.id}`);
    } else if (!assigned.query && route.query !== void 0 && route.query.length > 0) {
      return Path.normalize(`/${path}/${route.query}`);
    }
    return Path.normalize(`/${path}`);
  }

  /**
   * Gets the error subject.
   */
  @Class.Public()
  public get onErrors(): Observable.Subject<Response.Output> {
    return this.errorSubject;
  }

  /**
   * Gets the last error response.
   */
  @Class.Public()
  public get lastError(): Response.Output | undefined {
    return this.errorResponse;
  }

  /**
   * Sets a new API key for the subsequent requests.
   * @param key New API key.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public useKey(path: string): Driver {
    this.apiKey = path;
    return this;
  }

  /**
   * Sets a new API key header for the subsequent requests.
   * @param header New API key header name.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public useKeyHeaderName(header: string): Driver {
    this.apiKeyHeader = header;
    return this;
  }

  /**
   * Sets a new API count header for the subsequent requests.
   * @param header New API count header name.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public useCountHeaderName(header: string): Driver {
    this.apiCountHeader = header;
    return this;
  }

  /**
   * Connect to the API.
   * @param url Api URL.
   * @param key Api key.
   */
  @Class.Public()
  public async connect(url: string, key?: string): Promise<void> {
    this.apiUrl = url;
    this.apiKey = key;
  }

  /**
   * Insert the specified entity using a POST request.
   * @param model Model type.
   * @param views View modes.
   * @param entities Entity list.
   * @returns Returns a promise to get the id list of all inserted entities.
   * @throws Throws an error when the result body doesn't contains the insertion id.
   */
  @Class.Public()
  public async insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, views: string[], entities: T[]): Promise<string[]> {
    const list = [];
    const path = this.getPath({ model: model, query: Filters.toURL(model, views) });
    for (const entity of entities) {
      const response = await this.request('POST', path, entity);
      if (response.status.code !== 201 && response.status.code !== 202) {
        await this.errorSubject.notifyAll((this.errorResponse = response));
      } else if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).id !== 'string') {
        throw new Error(`The response body must be an object containing the insertion id.`);
      } else {
        list.push(response.body.id);
      }
    }
    return list;
  }

  /**
   * Search for all entities that corresponds to the specified filter using a GET request.
   * @param model Model type.
   * @param views View modes.
   * @param filter Fields filter.
   * @returns Returns a promise to get the list of found entities.
   * @throws Throws an error when the result body isn't an array.
   */
  @Class.Public()
  public async find<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, views: string[], filter: Mapping.Statements.Filter): Promise<T[]> {
    const path = this.getPath({ model: model, query: Filters.toURL(model, views, filter) });
    const response = await this.request('GET', path);
    if (response.status.code !== 200) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), [];
    } else if (!(response.body instanceof Array)) {
      throw new Error(`The response body must be an array containing the search results.`);
    }
    return <T[]>response.body;
  }

  /**
   * Find the entity that corresponds to the specified id using a GET request.
   * @param model Model type.
   * @param views View modes.
   * @param id Entity id.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, views: string[], id: any): Promise<T | undefined> {
    const path = this.getPath({ model: model, id: id.toString(), query: Filters.toURL(model, views) });
    const response = await this.request('GET', path);
    if (response.status.code !== 200) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), void 0;
    }
    return <T>response.body;
  }

  /**
   * Update all entities that corresponds to the specified matching fields using a PATCH request.
   * @param model Model type.
   * @param views View modes.
   * @param match Matching fields.
   * @param entity Entity data.
   * @returns Returns a promise to get the number of updated entities.
   */
  @Class.Public()
  public async update(model: Mapping.Types.Model, views: string[], match: Mapping.Statements.Match, entity: Mapping.Types.Entity): Promise<number> {
    const path = this.getPath({ model: model, query: Filters.toURL(model, views, { pre: match }) });
    const response = await this.request('PATCH', path, entity);
    if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), 0;
    }
    return parseInt(<string>response.headers[this.apiCountHeader]) || 0;
  }

  /**
   * Update the entity that corresponds to the specified id using a PATCH request.
   * @param model Model type.
   * @param views View modes.
   * @param id Entity id.
   * @param entity Entity data.
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Mapping.Types.Model, views: string[], id: any, entity: Mapping.Types.Entity): Promise<boolean> {
    const path = this.getPath({ model: model, id: id.toString(), query: Filters.toURL(model, views) });
    const response = await this.request('PATCH', path, entity);
    if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), false;
    }
    return true;
  }

  /**
   * Delete all entities that corresponds to the specified matching fields using a DELETE request.
   * @param model Model type.
   * @param match Matching fields.
   * @return Returns a promise to get the number of deleted entities.
   */
  @Class.Public()
  public async delete(model: Mapping.Types.Model, match: Mapping.Statements.Match): Promise<number> {
    const path = this.getPath({ model: model, query: Filters.toURL(model, [], { pre: match }) });
    const response = await this.request('DELETE', path);
    if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), 0;
    }
    return parseInt(<string>response.headers[this.apiCountHeader]) || 0;
  }

  /**
   * Delete the entity that corresponds to the specified id using a DELETE request.
   * @param model Model type.
   * @param id Entity id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Mapping.Types.Model, id: any): Promise<boolean> {
    const path = this.getPath({ model: model, id: id.toString() });
    const response = await this.request('DELETE', path);
    if (response.status.code !== 200 && response.status.code !== 202 && response.status.code !== 204) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), false;
    }
    return true;
  }

  /**
   * Count all corresponding entities using the a HEAD request.
   * @param model Model type.
   * @param views View modes.
   * @param filter Field filter.
   * @returns Returns a promise to get the total amount of found entities.
   */
  @Class.Public()
  public async count(model: Mapping.Types.Model, views: string[], filter: Mapping.Statements.Filter): Promise<number> {
    const path = this.getPath({ model: model, query: Filters.toURL(model, views, filter) });
    const response = await this.request('HEAD', path);
    if (response.status.code !== 200 && response.status.code !== 204) {
      return await this.errorSubject.notifyAll((this.errorResponse = response)), 0;
    }
    return parseInt(<string>response.headers[this.apiCountHeader]) || 0;
  }
}
