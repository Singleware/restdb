import * as Responses from '../responses';
import * as Types from '../types';
import { Driver as GenericDriver } from '../driver';
/**
 * Common driver class.
 */
export declare class Driver extends GenericDriver implements Types.Driver {
    /**
     * Header name for the authorization key.
     */
    private apiKeyHeader;
    /**
     * Header name for the counting results.
     */
    private apiCountingHeader;
    /**
     * Last request payload.
     */
    private lastPayload?;
    /**
     * Get the insert result from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the insertion or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    protected getInsertResponse<R>(model: Types.Model, response: Responses.Output): R | undefined;
    /**
     * Get the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    protected getFindResponse<R>(model: Types.Model, response: Responses.Output): R[] | undefined;
    /**
     * Get the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity either undefined when the entity wasn't found or an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    protected getFindByIdResponse<R>(model: Types.Model, response: Responses.Output): R | undefined;
    /**
     * Get the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    protected getUpdateResponse(model: Types.Model, response: Responses.Output): number | undefined;
    /**
     * Get the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status or undefined when an error occurs.
     */
    protected getUpdateByIdResponse(model: Types.Model, response: Responses.Output): boolean | undefined;
    /**
     * Get the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status or undefined when an error occurs.
     */
    protected getReplaceByIdResponse(model: Types.Model, response: Responses.Output): boolean | undefined;
    /**
     * Get the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    protected getDeleteResponse(model: Types.Model, response: Responses.Output): number | undefined;
    /**
     * Get the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status or undefined when an error occurs.
     */
    protected getDeleteByIdResponse(model: Types.Model, response: Responses.Output): boolean | undefined;
    /**
     * Get the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities or undefined when an error occurs.
     * @throws Throws an error when the server response is invalid.
     */
    protected getCountResponse(model: Types.Model, response: Responses.Output): number | undefined;
    /**
     * Get the request query string based on the specified entity model, filters and fields.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Fields to select.
     * @returns Returns the instance itself.
     */
    protected getRequestQuery(model: Types.Model, query?: Types.Query, fields?: string[]): string;
    /**
     * Set a new name for the API counting header.
     * @param name New header name.
     * @returns Returns the instance itself.
     */
    protected setCountingHeaderName(name: string): Driver;
    /**
     * Set a new name for the API key header.
     * @param name New header name.
     * @returns Returns the instance itself.
     */
    protected setKeyHeaderName(name: string): Driver;
    /**
     * Set a new value for the API key header.
     * @param value New header value.
     * @returns Returns the instance itself.
     */
    protected setKeyHeaderValue(value: string): Driver;
    /**
     * Get the last request payload.
     */
    get payload(): Types.Entity | Types.Entity[] | undefined;
}
