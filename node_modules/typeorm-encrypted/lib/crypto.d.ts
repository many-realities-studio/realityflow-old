/// <reference types="node" />
import { EncryptionOptions } from './options';
/**
 * Encrypt data.
 */
export declare function encryptData(data: Buffer, options: EncryptionOptions): Buffer;
/**
 * Decrypt data.
 */
export declare function decryptData(data: Buffer, options: EncryptionOptions): Buffer;
