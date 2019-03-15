/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Mapping from '@singleware/mapping';
import * as Path from '@singleware/path';

import { Entity } from './entity';
import { Request } from './request';
import { Response } from './response';
import { Search } from './search';

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
   * Temporary path for the next request.
   */
  @Class.Private()
  private apiPath?: string;

  /**
   * Last error response.
   */
  @Class.Private()
  private apiErrorResponse?: Response;

  /**
   * Subject to notify any API error.
   */
  @Class.Private()
  private apiErrorSubject = new Observable.Subject<Response>();

  /**
   * Call an HTTP request using native browser methods (frontend).
   * @param method Request method.
   * @param path Request path.
   * @param headers Request headers.
   * @param content Request content.
   * @returns Returns a promise to get the request response.
   */
  @Class.Private()
  private async frontCall(method: string, path: string, headers: Mapping.Types.Entity, content?: Mapping.Types.Entity): Promise<Response> {
    const response = await fetch(`${this.apiUrl}/${path}`, {
      method: method,
      headers: new Headers(headers),
      body: content ? JSON.stringify(content) : void 0
    });
    const body = await response.text();
    return <Response>{
      request: <Request>{
        url: response.url,
        body: content
      },
      statusCode: response.status,
      statusText: response.statusText,
      body: body.length > 0 ? JSON.parse(body) : void 0
    };
  }

  /**
   * Call an HTTP request using native nodejs methods. (backend)
   * @param method Request method.
   * @param path Request path.
   * @param headers Request headers.
   * @param content Request content.
   * @returns Returns a promise to get the request response.
   */
  @Class.Private()
  private async backCall(method: string, path: string, headers: Mapping.Types.Entity, content?: Mapping.Types.Entity): Promise<Response> {
    const url = new URL(`${this.apiUrl}/${path}`);
    const client = require(url.protocol);
    let data: string | undefined;
    if (content) {
      data = JSON.stringify(content);
      headers['Content-Length'] = data.length;
    }
    return new Promise<any>(
      (resolve: (value: any) => void, reject: (value: any) => void): void => {
        const request = client.request(
          {
            method: method,
            headers: headers,
            protocol: url.protocol,
            port: url.port,
            host: url.hostname,
            path: url.pathname
          },
          (response: any): void => {
            let body = '';
            response.setEncoding('utf8');
            response.on('error', (error: string) => {
              reject(error);
            });
            response.on('data', (data: string) => {
              body += data;
            });
            response.on('end', () => {
              resolve({
                request: {
                  url: response.url,
                  body: content
                },
                statusCode: response.statusCode,
                statusText: response.statusText,
                body: body.length > 0 ? JSON.parse(body) : void 0
              });
            });
          }
        );
        if (data) {
          request.write(data);
          request.end();
        }
      }
    );
  }

  /**
   * Send an HTTP request.
   * @param method Request method.
   * @param path Request path.
   * @param body Request body.
   * @returns Returns a promise to get the request response.
   */
  @Class.Private()
  private request(method: string, path: string, body?: Mapping.Types.Entity): Promise<Response> {
    const headers = <Mapping.Types.Entity>{};
    const content = body ? Entity.extractMap(body) : void 0;
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    if (typeof window !== typeof void 0) {
      return this.frontCall(method, path, headers, content);
    }
    return this.backCall(method, path, headers, content);
  }

  /**
   * Gets a new request path based on the specified model type.
   * @param model Mode type.
   * @param complement Path complement.
   * @returns Returns the generated path.
   * @throws Throws an error when the model type is not valid.
   */
  @Class.Private()
  private getPath(model: Mapping.Types.Model, complement?: string): string {
    let path = Mapping.Schema.getStorage(model);
    if (!path) {
      throw new Error(`There is no path for the specified model entity.`);
    } else if (this.apiPath) {
      path += `/${Path.normalize(this.apiPath.replace('%0', complement || ''))}`;
      this.apiPath = void 0;
    } else if (complement) {
      path += `/${complement}`;
    }
    return Path.normalize(path);
  }

  /**
   * Gets the error subject.
   */
  @Class.Public()
  public get onErrors(): Observable.Subject<Response> {
    return this.apiErrorSubject;
  }

  /**
   * Gets the last error response.
   */
  @Class.Public()
  public get lastError(): Response | undefined {
    return this.apiErrorResponse;
  }

  /**
   * Sets the new API key for subsequent requests.
   * @param key New API key.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public useKey(path: string): Driver {
    this.apiKey = path;
    return this;
  }

  /**
   * Sets a temporary path for the next request.
   * Use: %0 to set the complementary path string.
   * @param path Path to be set.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public usePath(path: string): Driver {
    this.apiPath = path;
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
   * Insert the specified entity by POST request.
   * @param model Model type.
   * @param entities Entity list.
   * @returns Returns a promise to get the id list of all inserted entities.
   */
  @Class.Public()
  public async insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, entities: T[]): Promise<string[]> {
    const list = [];
    for (const entity of entities) {
      const response = await this.request('POST', this.getPath(model), entity);
      if (response.statusCode === 201) {
        if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).id !== 'string') {
          throw new Error(`The body must be an object containing the inserted result id.`);
        }
        list.push(response.body.id);
      } else {
        this.apiErrorResponse = response;
        await this.apiErrorSubject.notifyAll(response);
      }
    }
    return list;
  }

  /**
   * Search for the corresponding entities by GET request.
   * @param model Model type.
   * @param joins List of joins (Not supported).
   * @param filter Fields filter.
   * @param sort Sorting fields.
   * @param limit Result limits.
   * @returns Returns a promise to get the list of entities found.
   */
  @Class.Public()
  public async find<T extends Mapping.Types.Entity>(
    model: Mapping.Types.Model<T>,
    joins: Mapping.Statements.Join[],
    filter: Mapping.Statements.Filter,
    sort?: Mapping.Statements.Sort,
    limit?: Mapping.Statements.Limit
  ): Promise<T[]> {
    const response = await this.request('GET', this.getPath(model, Search.toURL(model, [filter], sort, limit)));
    if (response.statusCode === 200) {
      if (!(response.body instanceof Array)) {
        throw new Error(`The body must be an array containing the search results.`);
      }
      return <T[]>response.body;
    }
    this.apiErrorResponse = response;
    await this.apiErrorSubject.notifyAll(response);
    return [];
  }

  /**
   * Find the entity that corresponds to the specified entity id by GET request.
   * @param model Model type.
   * @param joins Joined columns (Not supported).
   * @param id Entity id.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Mapping.Types.Entity>(
    model: Mapping.Types.Model<T>,
    joins: Mapping.Statements.Join[],
    id: any
  ): Promise<T | undefined> {
    const response = await this.request('GET', this.getPath(model, id));
    if (response.statusCode === 200) {
      return <T>response.body;
    }
    this.apiErrorResponse = response;
    await this.apiErrorSubject.notifyAll(response);
    return void 0;
  }

  /**
   * Update all entities that corresponds to the specified filter by PATCH request.
   * @param model Model type.
   * @param entity Entity data.
   * @param filter Fields filter.
   * @returns Returns a promise to get the number of updated entities.
   * @throws Throws an error when the response doesn't have the object with the total of updated results.
   */
  @Class.Public()
  public async update(model: Mapping.Types.Model, entity: Mapping.Types.Entity, filter: Mapping.Statements.Filter): Promise<number> {
    const response = await this.request('PATCH', this.getPath(model, Search.toURL(model, [filter])), entity);
    if (response.statusCode === 200) {
      if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).total !== 'number') {
        throw new Error(`The body must be an object containing the total of updated results.`);
      }
      return (<Mapping.Types.Entity>response.body).total;
    }
    this.apiErrorResponse = response;
    await this.apiErrorSubject.notifyAll(response);
    return 0;
  }

  /**
   * Update an entity that corresponds to the specified entity id by PATCH request.
   * @param model Model type.
   * @param entity Entity data.
   * @param id Entity id.
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Mapping.Types.Model, entity: Mapping.Types.Entity, id: any): Promise<boolean> {
    const response = await this.request('PATCH', this.getPath(model, id), entity);
    if (response.statusCode === 200 || response.statusCode === 204) {
      return true;
    }
    this.apiErrorResponse = response;
    await this.apiErrorSubject.notifyAll(response);
    return false;
  }

  /**
   * Delete all entities that corresponds to the specified filter by DELETE request.
   * @param model Model type.
   * @param filter Fields filter.
   * @return Returns a promise to get the number of deleted entities.
   * @throws Throws an error when the response doesn't have the object with the total of deleted results.
   */
  @Class.Public()
  public async delete(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): Promise<number> {
    const response = await this.request('DELETE', this.getPath(model, Search.toURL(model, [filter])));
    if (response.statusCode === 200) {
      if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).total !== 'number') {
        throw new Error(`The body must be an object containing the total of deleted results.`);
      }
      return (<Mapping.Types.Entity>response.body).total;
    }
    this.apiErrorResponse = response;
    await this.apiErrorSubject.notifyAll(response);
    return 0;
  }

  /**
   * Delete an entity that corresponds to the specified id by DELETE request.
   * @param model Model type.
   * @param id Entity id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Mapping.Types.Model, id: any): Promise<boolean> {
    const response = await this.request('DELETE', this.getPath(model, id));
    if (response.statusCode === 200 || response.statusCode === 204) {
      return true;
    }
    this.apiErrorResponse = response;
    await this.apiErrorSubject.notifyAll(response);
    return false;
  }
}
