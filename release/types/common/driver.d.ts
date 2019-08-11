import * as Responses from '../responses';
import * as Aliases from '../aliases';
import { Driver as GenericDriver } from '../driver';
/**
 * Common driver class.
 */
export declare class Driver extends GenericDriver implements Aliases.Driver {
    /**
     * Header name for the authorization key.
     */
    private apiKeyHeader;
    /**
     * Header name for the counting results.
     */
    private apiCountingHeader;
    /**
     * API response error.
     */
    private apiResponseError?;
    /**
     * Gets the request query string based on the specified entity model, fields and filters.
     * @param model Entity model.
     * @param query Query filter.
     * @param fields Viewed fields.
     * @returns Returns the parsed query string.
     */
    protected getRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string;
    /**
     * Gets the result Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the result Id or undefined when the result Id wasn't found.
     * @throws Throws an error when the response payload doesn't contains the result Id.
     */
    protected getInsertResponse(model: Aliases.Model, response: Responses.Output): string | undefined;
    /**
     * Gets the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list.
     * @throws Throws an error when the response payload doesn't contains the entity list.
     */
    protected getFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Responses.Output): T[];
    /**
     * Gets the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity or undefined when the entity was not found.
     */
    protected getFindByIdResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Responses.Output): T | undefined;
    /**
     * Gets the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities.
     * @throws Throws an error when the counting header is missing or incorrect in the response.
     */
    protected getUpdateResponse(model: Aliases.Model, response: Responses.Output): number;
    /**
     * Gets the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status.
     */
    protected getUpdateByIdResponse(model: Aliases.Model, response: Responses.Output): boolean;
    /**
     * Gets the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected getReplaceByIdResponse(model: Aliases.Model, response: Responses.Output): boolean;
    /**
     * Gets the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities.
     * @throws Throws an error when the counting header is missing or incorrect in the response.
     */
    protected getDeleteResponse(model: Aliases.Model, response: Responses.Output): number;
    /**
     * Gets the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status.
     */
    protected getDeleteByIdResponse(model: Aliases.Model, response: Responses.Output): boolean;
    /**
     * Gets the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities.
     * @throws Throws an error when the counting header is missing or incorrect in the response.
     */
    protected getCountResponse(model: Aliases.Model, response: Responses.Output): number;
    /**
     * Notify an error in the given response entity for all listeners.
     * @param model Entity model.
     * @param response Response entity.
     */
    protected notifyErrorResponse(model: Aliases.Model, response: Responses.Output): Promise<void>;
    /**
     * Sets a new name for the API counting header.
     * @param name New header name.
     * @returns Returns its own instance.
     */
    protected setCountingHeaderName(name: string): Driver;
    /**
     * Sets a new name for the API key header.
     * @param name New header name.
     * @returns Returns its own instance.
     */
    protected setKeyHeaderName(name: string): Driver;
    /**
     * Sets a new value for the API key header.
     * @param value New header value.
     * @returns Returns its own instance.
     */
    protected setKeyHeaderValue(value: string): Driver;
    /**
     * Gets the request error response.
     * @returns Returns the error response entity or undefined when there's no error.
     */
    protected readonly errorResponse: Aliases.Entity | undefined;
}
