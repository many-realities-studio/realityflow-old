import { ObjectLiteral } from 'typeorm';
/**
 * Encrypt fields on entity.
 */
export declare function encrypt<T extends ObjectLiteral>(entity: any): any;
/**
 * Decrypt fields on entity.
 */
export declare function decrypt<T extends ObjectLiteral>(entity: any): any;
