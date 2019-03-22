/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Mapping from '@singleware/mapping';
import * as Path from '@singleware/path';

import { Route } from './route';
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
   * Temporary path for the next request.
   */
  @Class.Private()
  private apiPath?: string;

  /**
   * Key for authenticated requests.
   */
  @Class.Private()
  private apiKey?: string;

  /**
   * Header name for the authentication key.
   */
  @Class.Private()
  private apiHeader: string = 'X-API-Key';

  /**
   * Last error response.
   */
  @Class.Private()
  private errorResponse?: Response;

  /**
   * Subject to notify any API error.
   */
  @Class.Private()
  private errorSubject = new Observable.Subject<Response>();

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
    const response = await fetch(`${this.apiUrl}${path}`, {
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
    const url = new URL(`${this.apiUrl}${path}`);
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
      headers[this.apiHeader] = this.apiKey;
    }
    if (typeof window !== typeof void 0) {
      return this.frontCall(method, path, headers, content);
    }
    return this.backCall(method, path, headers, content);
  }

  /**
   * Gets a new request path based on the specified route information.
   * @param route Route information.
   * @returns Returns the generated path.
   */
  @Class.Private()
  private getPath(route: Route): string {
    const path = <Mapping.Types.Entity>{
      model: `/${Mapping.Schema.getStorage(route.model)}`,
      query: route.query ? `/${route.query}` : '',
      id: route.id ? `/${route.id}` : ''
    };
    if (this.apiPath) {
      return Path.normalize(this.apiPath.replace(/{model}|{id}|{query}/g, (match: string) => path[match]));
    } else {
      return Path.normalize(`${path.model}${path.id}${path.query}`);
    }
  }

  /**
   * Gets the error subject.
   */
  @Class.Public()
  public get onErrors(): Observable.Subject<Response> {
    return this.errorSubject;
  }

  /**
   * Gets the last error response.
   */
  @Class.Public()
  public get lastError(): Response | undefined {
    return this.errorResponse;
  }

  /**
   * Sets a new API key for subsequent requests.
   * @param key New API key.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public useKey(path: string): Driver {
    this.apiKey = path;
    return this;
  }

  /**
   * Sets a new API key header for subsequent requests.
   * @param header New API key header.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public useHeader(header: string): Driver {
    this.apiHeader = header;
    return this;
  }

  /**
   * Sets a temporary path for the next request.
   * Use: {} to set the complementary path string.
   * @param path Path to be set.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public usePath(path: string): Driver {
    this.apiPath = Path.normalize(`/${path}`);
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
   * Insert the specified entity using the POST request.
   * @param model Model type.
   * @param views View modes.
   * @param entities Entity list.
   * @returns Returns a promise to get the id list of all inserted entities.
   */
  @Class.Public()
  public async insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, views: string[], entities: T[]): Promise<string[]> {
    const list = [];
    const path = this.getPath({ model: model, query: Search.toURL(model, views) });
    for (const entity of entities) {
      const response = await this.request('POST', path, entity);
      if (response.statusCode !== 201) {
        this.errorResponse = response;
        await this.errorSubject.notifyAll(response);
      } else if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).id !== 'string') {
        throw new Error(`The response body must be an object containing the inserted id.`);
      } else {
        list.push(response.body.id);
      }
    }
    return list;
  }

  /**
   * Search for all entities that corresponds to the specified filters using the GET request.
   * @param model Model type.
   * @param views View modes.
   * @param filter Fields filter.
   * @param sort Sorting fields.
   * @param limit Result limits.
   * @returns Returns a promise to get the list of entities found.
   */
  @Class.Public()
  public async find<T extends Mapping.Types.Entity>(
    model: Mapping.Types.Model<T>,
    views: string[],
    filter: Mapping.Statements.Filter,
    sort?: Mapping.Statements.Sort,
    limit?: Mapping.Statements.Limit
  ): Promise<T[]> {
    const path = this.getPath({ model: model, query: Search.toURL(model, views, filter, sort, limit) });
    const response = await this.request('GET', path);
    if (response.statusCode !== 200) {
      this.errorResponse = response;
      await this.errorSubject.notifyAll(response);
      return [];
    } else if (!(response.body instanceof Array)) {
      throw new Error(`The response body must be an array containing the search results.`);
    } else {
      return <T[]>response.body;
    }
  }

  /**
   * Find the entity that corresponds to the specified entity id using the GET request.
   * @param model Model type.
   * @param views View modes.
   * @param id Entity id.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Mapping.Types.Entity>(model: Mapping.Types.Model<T>, views: string[], id: any): Promise<T | undefined> {
    const path = this.getPath({ model: model, id: id, query: Search.toURL(model, views) });
    const response = await this.request('GET', path);
    if (response.statusCode !== 200) {
      this.errorResponse = response;
      await this.errorSubject.notifyAll(response);
      return void 0;
    } else {
      return <T>response.body;
    }
  }

  /**
   * Update all entities that corresponds to the specified filter using the PATCH request.
   * @param model Model type.
   * @param views View modes.
   * @param filter Fields filter.
   * @param entity Entity data.
   * @returns Returns a promise to get the number of updated entities.
   * @throws Throws an error when the response doesn't have the object with the total of updated results.
   */
  @Class.Public()
  public async update(model: Mapping.Types.Model, views: string[], filter: Mapping.Statements.Filter, entity: Mapping.Types.Entity): Promise<number> {
    const path = this.getPath({ model: model, query: Search.toURL(model, views, filter) });
    const response = await this.request('PATCH', path, entity);
    if (response.statusCode !== 200) {
      this.errorResponse = response;
      await this.errorSubject.notifyAll(response);
      return 0;
    } else if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).total !== 'number') {
      throw new Error(`The response body must be an object containing the total of updated results.`);
    } else {
      return (<Mapping.Types.Entity>response.body).total;
    }
  }

  /**
   * Update the entity that corresponds to the specified entity id using the PATCH request.
   * @param model Model type.
   * @param views View modes.
   * @param id Entity id.
   * @param entity Entity data.
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Mapping.Types.Model, views: string[], id: any, entity: Mapping.Types.Entity): Promise<boolean> {
    const path = this.getPath({ model: model, id: id, query: Search.toURL(model, views) });
    const response = await this.request('PATCH', path, entity);
    if (response.statusCode !== 200 && response.statusCode !== 204) {
      this.errorResponse = response;
      await this.errorSubject.notifyAll(response);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Delete all entities that corresponds to the specified filter using the DELETE request.
   * @param model Model type.
   * @param filter Fields filter.
   * @return Returns a promise to get the number of deleted entities.
   * @throws Throws an error when the response doesn't have the object with the total of deleted results.
   */
  @Class.Public()
  public async delete(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): Promise<number> {
    const path = this.getPath({ model: model, query: Search.toURL(model, [], filter) });
    const response = await this.request('DELETE', path);
    if (response.statusCode !== 200) {
      this.errorResponse = response;
      await this.errorSubject.notifyAll(response);
      return 0;
    } else if (!(response.body instanceof Object) || typeof (<Mapping.Types.Entity>response.body).total !== 'number') {
      throw new Error(`The body must be an object containing the total of deleted results.`);
    } else {
      return (<Mapping.Types.Entity>response.body).total;
    }
  }

  /**
   * Delete the entity that corresponds to the specified id using the DELETE request.
   * @param model Model type.
   * @param id Entity id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Mapping.Types.Model, id: any): Promise<boolean> {
    const path = this.getPath({ model: model, id: id });
    const response = await this.request('DELETE', path);
    if (response.statusCode !== 200 && response.statusCode !== 204) {
      this.errorResponse = response;
      await this.errorSubject.notifyAll(response);
      return false;
    } else {
      return true;
    }
  }
}
