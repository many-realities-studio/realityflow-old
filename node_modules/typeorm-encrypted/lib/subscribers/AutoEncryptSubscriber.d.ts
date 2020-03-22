import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
export declare class AutoEncryptSubscriber implements EntitySubscriberInterface {
    /**
     * Encrypt before insertion.
     */
    beforeInsert(event: InsertEvent<any>): void;
    /**
     * Encrypt before update.
     */
    beforeUpdate(event: UpdateEvent<any>): void;
    /**
     * Decrypt after find.
     */
    afterLoad(entity: any): void;
}
