/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Response from '../response';

import { Input } from './input';

/**
 * Frontend client class.
 */
@Class.Describe()
export class Frontend extends Class.Null {
  @Class.Private()
  private static getHeaders(headers: Headers): any {
    const data = <any>{};
    for (const name in headers) {
      data[name] = <string>headers.get(name);
    }
    return data;
  }

  @Class.Public()
  public static async request(input: Input): Promise<Response.Output> {
    const response = await fetch(input.url, {
      method: input.method,
      headers: new Headers(<any>input.headers),
      body: input.content ? JSON.stringify(input.content) : void 0
    });
    const body = await response.text();
    return <Response.Output>{
      input: input,
      status: {
        code: response.status,
        message: response.statusText
      },
      headers: this.getHeaders(response.headers),
      body: body.length > 0 ? JSON.parse(body) : void 0
    };
  }
}
