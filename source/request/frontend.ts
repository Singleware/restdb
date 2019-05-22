/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Response from '../response';

import { Input } from './input';
import { Headers as ResponseHeaders } from '../headers';

/**
 * Frontend client class.
 */
@Class.Describe()
export class Frontend extends Class.Null {
  /**
   * Get all the response headers as a native headers map.
   * @param headers Non-native headers object.
   * @returns Returns the native headers map.
   */
  @Class.Private()
  private static getHeaders(headers: Headers): ResponseHeaders {
    const data = <ResponseHeaders>{};
    const entries = headers.entries();
    for (const entry of entries) {
      const [name, value] = entry;
      const current = data[name];
      if (current === void 0) {
        data[name] = <string>headers.get(name);
      } else if (current instanceof Array) {
        current.push(value);
      } else {
        data[name] = [current];
      }
    }
    return data;
  }

  /**
   * Request a new response from the API using a frontend HTTP client.
   * @param input Request input.
   * @returns Returns the request output.
   */
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
