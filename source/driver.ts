/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Mapping from '@singleware/mapping';

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
   * Gets the path from the specified model type.
   * @param model Mode type.
   * @returns Returns the path.
   * @throws Throws an error when the model type is not valid.
   */
  @Class.Private()
  private getPath(model: Class.Constructor<Mapping.Entity>): string {
    const name = Mapping.Schema.getStorage(model);
    if (!name) {
      throw new Error(`There is no path for the specified model type.`);
    }
    return name;
  }

  /**
   * Extract all columns from the given entity list into a raw object.
   * @param entities Entities list.
   * @returns Returns the new generated list.
   */
  @Class.Private()
  private extractArray(entities: any[]): any[] {
    const newer = [];
    for (const entity of entities) {
      newer.push(this.extractValue(entity));
    }
    return newer;
  }

  /**
   * Extract all columns from the given entity into a raw object.
   * @param entity Entity data.
   * @returns Returns the new generated object.
   */
  @Class.Private()
  private extractObject(entity: Mapping.Entity): Mapping.Entity {
    const newer = <Mapping.Entity>{};
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
  private extractValue(value: any): any {
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
  private async request(method: string, path: string, body?: Mapping.Entity): Promise<Response> {
    const options = <Mapping.Entity>{ method: method, headers: new Headers() };
    if (this.apiKey) {
      options.headers.append('X-API-Key', this.apiKey);
    }
    if (body) {
      options.body = JSON.stringify(this.extractObject(body));
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
   * Insert the specified entity into the API.
   * @param model Model type.
   * @param entities Entity data list.
   * @returns Returns the list inserted entities.
   */
  @Class.Public()
  public async insert<T extends Mapping.Entity>(model: Class.Constructor<Mapping.Entity>, ...entities: T[]): Promise<string[]> {
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
   * @param aggregate Joined columns.
   * @returns Returns the list of entities found.
   */
  @Class.Public()
  public async find<T extends Mapping.Entity>(
    model: Class.Constructor<T>,
    filter: Mapping.Expression,
    aggregate: Mapping.Aggregate[]
  ): Promise<T[]> {
    const filters = Filters.toURL(model, filter);
    const response = await this.request('GET', `${this.getPath(model)}${filters}`);
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
  public async findById<T extends Mapping.Entity>(
    model: Class.Constructor<T>,
    value: any,
    aggregate: Mapping.Aggregate[]
  ): Promise<T | undefined> {
    const response = await this.request('GET', `${this.getPath(model)}/${value}`);
    return response.status === 200 ? await response.json() : void 0;
  }

  /**
   * Update all entities that corresponds to the specified filter.
   * @param model Model type.
   * @param filter Filter expression.
   * @param entity Entity data to be updated.
   * @returns Returns the number of updated entities.
   */
  @Class.Public()
  public async update(model: Class.Constructor<Mapping.Entity>, filter: Mapping.Expression, entity: Mapping.Entity): Promise<number> {
    const filters = Filters.toURL(model, filter);
    const response = await this.request('PATCH', `${this.getPath(model)}/${filters}`, entity);
    return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
  }

  /**
   * Update the entity that corresponds to the specified entity id.
   * @param model Model type.
   * @param value Entity id.
   * @param entity Entity data to be updated.
   * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
   */
  @Class.Public()
  public async updateById(model: Class.Constructor<Mapping.Entity>, value: any, entity: Mapping.Entity): Promise<boolean> {
    const response = await this.request('PATCH', `${this.getPath(model)}/${value}`, entity);
    return response.status === 200 || response.status === 204;
  }

  /**
   * Delete all entities that corresponds to the specified filter.
   * @param model Model type.
   * @param filter Filter columns.
   * @return Returns the number of deleted entities.
   */
  @Class.Public()
  public async delete(model: Class.Constructor<Mapping.Entity>, filter: Mapping.Expression): Promise<number> {
    const filters = Filters.toURL(model, filter);
    const response = await this.request('DELETE', `${this.getPath(model)}/${filters}`);
    return response.status === 200 || response.status === 204 ? parseInt((await response.json()).total) : 0;
  }

  /**
   * Delete the entity that corresponds to the specified entity id.
   * @param model Model type.
   * @param value Entity id.
   * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
   */
  @Class.Public()
  public async deleteById(model: Class.Constructor<Mapping.Entity>, value: any): Promise<boolean> {
    const response = await this.request('DELETE', `${this.getPath(model)}/${value}`);
    return response.status === 200 || response.status === 204;
  }
}
