import * as Response from '../response';
import * as Aliases from '../aliases';
import { Driver as GenericDriver } from '../driver';
/**
 * Common driver class.
 */
export declare class Driver extends GenericDriver implements Aliases.Driver {
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
    protected parseRequestQuery(model: Aliases.Model, query?: Aliases.Query, fields?: string[]): string;
    /**
     * Gets the inserted Id from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the inserted Id or undefined when the inserted Id wasn't found.
     * @throws Throws an error when the response payload doesn't contains the inserted Id.
     */
    protected parseInsertResponse(model: Aliases.Model, response: Response.Output): string | undefined;
    /**
     * Gets the found entity list from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity list.
     * @throws Throws an error when the response payload doesn't contains the entity list.
     */
    protected parseFindResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): T[];
    /**
     * Gets the found entity from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the entity or undefined when the entity was not found.
     */
    protected parseFindByIdResponse<T extends Aliases.Entity>(model: Aliases.Model, response: Response.Output): T | undefined;
    /**
     * Gets the number of updated entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of updated entities.
     */
    protected parseUpdateResponse(model: Aliases.Model, response: Response.Output): number;
    /**
     * Gets the updated entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the updated entity status.
     */
    protected parseUpdateByIdResponse(model: Aliases.Model, response: Response.Output): boolean;
    /**
     * Gets the replaced entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the replaced entity status.
     * @throws It will always throws an error because it's not implemented yet.
     */
    protected parseReplaceByIdResponse(model: Aliases.Model, response: Response.Output): boolean;
    /**
     * Gets the number of deleted entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of deleted entities.
     */
    protected parseDeleteResponse(model: Aliases.Model, response: Response.Output): number;
    /**
     * Gets the deleted entity status from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the deleted entity status.
     */
    protected parseDeleteByIdResponse(model: Aliases.Model, response: Response.Output): boolean;
    /**
     * Gets the number of entities from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     * @returns Returns the number of entities.
     */
    protected parseCountResponse(model: Aliases.Model, response: Response.Output): number;
    /**
     * Parses the error response from the given response entity.
     * @param model Entity model.
     * @param response Response entity.
     */
    protected parseErrorResponse(mode: Aliases.Model, response: Response.Output): void;
    /**
     * Sets a new API counting header for the subsequent requests.
     * @param name New header name.
     * @returns Returns the own instance.
     */
    protected setCountingHeaderName(name: string): Driver;
    /**
     * Gets the last request error response.
     * @returns Returns the error response entity or undefined when there's no error.
     */
    protected getErrorResponse(): Aliases.Entity | undefined;
}
