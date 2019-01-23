/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';
import * as Path from '@singleware/path';

import { Filters } from './filters';

/**
 * Data driver class.
 */
@Class.Describe()
export class Driver extends Class.Null implements Mapping.Driver {
  /**
   * Api endpoint base URL.
   */
  @Class.Private()
  private apiUrl?: string;

  /**
   * Api key for authenticated requests.
   */
  @Class.Private()
  private apiKey?: string;

  /**
   * Api extra path.
   */
  @Class.Private()
  private extraPath?: string;

  /**
   * Gets a new request path based on the specified model type.
   * @param model Mode type.
   * @param complement Path complement.
   * @returns Returns the generated path.
   * @throws Throws an error when the model type is not valid.
   */
  @Class.Private()
  private getPath(model: Mapping.Types.Model, complement?: string): string {
    const path = Mapping.Schema.getStorage(model);
    if (!path) {
      throw new Error(`There is no path for the specified model entity.`);
    }
    if (this.extraPath) {
      return Path.normalize(`${path}/${this.extraPath.replace('%0', complement || '')}`);
    }
    return path;
  }

  /**
   * Extract all properties from the given entity list into a raw object list.
   * @param entities Entities list.
   * @returns Returns the new generated list.
   */
  @Class.Private()
  private static extractArray(entities: any[]): any[] {
    const newer = <Mapping.Types.Entity[]>[];
    for (const entity of entities) {
      newer.push(this.extractValue(entity));
    }
    return newer;
  }

  /**
   * Extract all properties from the given entity into a raw object map.
   * @param entity Entity data.
   * @returns Returns the new generated object.
   */
  @Class.Private()
  private static extractObject(entity: Mapping.Types.Entity): Mapping.Types.Entity {
    const newer = <Mapping.Types.Entity>{};
    for (const column in entity) {
      newer[column] = this.extractValue(entity[column]);
    }
    return newer;
  }

  /**
   * Extract the value from the given entity into a raw value.
   * @param value Value to be extracted.
   * @returns Returns the new generated object.
   */
  @Class.Private()
  private static extractValue(value: any): any {
    if (value instanceof Array) {
      return this.extractArray(value);
    } else if (value instanceof Object) {
      return this.extractObject(value);
    }
    return value;
  }

  /**
   * Send an HTTP request.
   * @param method Request method.
   * @param path Request path.
   * @param body Request body.
   * @returns Returns a promise to get the HTTP response.
   */
  @Class.Private()
  private async request(method: string, path: string, body?: Mapping.Types.Entity): Promise<Response> {
    const options = <Mapping.Types.Entity>{ method: method, headers: new Headers() };
    if (this.apiKey) {
      options.headers.append('X-API-Key', this.apiKey);
    }
    if (body) {
      options.body = JSON.stringify(Driver.extractObject(body));
    }
    return await fetch(`${this.apiUrl}/${path}`, options);
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
   * Set a temporary path for the next request.
   * Use: %0 to set the complementary path string.
   * @param path Path to be set.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public usePath(path: string): Driver {
    this.extraPath = path;
    return this;
  }

  /**
   * Insert the specified entity into the API.
   * @param model Model type.
   * @param entities Entity data list.
   * @returns Returns the list inserted entities.
   */
  @Class.Public()
  public async insert<T extends Mapping.Types.Entity>(model: Mapping.Types.Model, entities: T[]): Promise<string[]> {
    const list = [];
    for (const entity of entities) {
      const response = await this.request('POST', this.getPath(model), entity);
      if (response.status === 201) {
        list.push((await response.json()).id);
      }
    }
    return list;
  }

  /**
   * Find the corresponding entity from the API.
   * @param model Model type.
   * @param filter Filter expression.
   * @param joins Joined columns.
   * @returns Returns the list of entities found.
   */
  @Class.Public()
  public async find<T extends Mapping.Types.Entity>(
    model: Mapping.Types.Model<T>,
    joins: Mapping.Statements.Join[],
    filters: Mapping.Statements.Filter[],
    sort?: Mapping.Statements.Sort,
    limit?: Mapping.Statements.Limit
  ): Promise<T[]> {
    const urlFilter = Filters.toURL(model, filters[0]);
    const response = await this.request('GET', this.getPath(model, urlFilter));
    return response.status === 200 ? await response.json() : [];
  }

  /**
   * Find the entity that corresponds to the specified entity id.
   * @param model Model type.
   * @param value Entity id value.
   * @param aggregate Joined columns.
   * @returns Returns a promise to get the found entity or undefined when the entity was not found.
   */
  @Class.Public()
  public async findById<T extends Mapping.Types.Entity>(
    model: Mapping.Types.Model<T>,
    joins: Mapping.Statements.Join[],
    id: any
  ): Promise<T | undefined> {
    const response = await this.request('GET', this.getPath(model, id));
    return response.status === 200 ? await response.json() : void 0;
  }

  /**
   * Update all entities that corresponds to the specified filter.
   * @param model Model type.
   * @param entity Entity data to be updated.
   * @param filter Filter expression.
   * @returns Returns the number of updated entities.
   */
  @Class.Public()
  public async update(model: Mapping.Types.Model, entity: Mapping.Types.Entity, filter: Mapping.Statements.Filter): Promise<number> {
    const urlFilter = Filters.toURL(model, filter);
    const response = await this.request('PATCH', this.getPath(model, urlFilter), entity);
    return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
  }

  /**
   * Update the entity that corresponds to the specified entity id.
   * @param model Model type.
   * @param entity Entity data to be updated.
   * @param id Entity id.s
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Mapping.Types.Model, entity: Mapping.Types.Entity, id: any): Promise<boolean> {
    const response = await this.request('PATCH', this.getPath(model, id), entity);
    return response.status === 200 || response.status === 204;
  }

  /**
   * Delete all entities that corresponds to the specified filter.
   * @param model Model type.
   * @param filter Filter columns.
   * @return Returns the number of deleted entities.
   */
  @Class.Public()
  public async delete(model: Mapping.Types.Model, filter: Mapping.Statements.Filter): Promise<number> {
    const urlFilter = Filters.toURL(model, filter);
    const response = await this.request('DELETE', this.getPath(model, urlFilter));
    return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
  }

  /**
   * Delete the entity that corresponds to the specified entity id.
   * @param model Model type.
   * @param id Entity id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Mapping.Types.Model, id: any): Promise<boolean> {
    const response = await this.request('DELETE', this.getPath(model, id));
    return response.status === 200 || response.status === 204;
  }
}
