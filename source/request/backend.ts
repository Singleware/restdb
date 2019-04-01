/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Http from 'http';
import * as Class from '@singleware/class';

import * as Response from '../response';

import { Input } from './input';

/**
 * Backend client class.
 */
@Class.Describe()
export class Backend extends Class.Null {
  /**
   * Request a new response from the API using a backend HTTP client.
   * @param input Request input.
   * @returns Returns the request output.
   */
  @Class.Public()
  public static async request(input: Input): Promise<Response.Output> {
    const url = new URL(input.url);
    const client = require(url.protocol);
    let data: string | undefined;
    if (input.content) {
      data = JSON.stringify(input.content);
      input.headers['Content-Length'] = data.length.toString();
    }
    return new Promise<Response.Output>(
      (resolve: (value: Response.Output) => void, reject: (value: any) => void): void => {
        const options = {
          method: input.method,
          headers: input.headers,
          protocol: url.protocol,
          port: url.port,
          host: url.hostname,
          path: url.pathname
        };
        const request = client.request(
          options,
          (response: Http.IncomingMessage): void => {
            let body = '';
            response
              .setEncoding('utf8')
              .on('data', (data: string) => {
                body += data;
              })
              .on('error', (error: string) => {
                reject(error);
              })
              .on('end', () => {
                resolve({
                  input: input,
                  status: {
                    code: response.statusCode || 0,
                    message: response.statusMessage || ''
                  },
                  headers: response.headers,
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
}
