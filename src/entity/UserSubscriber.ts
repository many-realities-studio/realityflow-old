import { EventSubscriber, EntitySubscriberInterface, UpdateEvent } from "typeorm";
import { User } from "./user";
import *  as bcrypt from "bcrypt"
const SALT_WORK_FACTOR = 10;

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User>{
    listenTo(){
        return User
    }

    async beforeInsert(event: UpdateEvent<User>){
        // console.log(event)
        event.entity.Password = await bcrypt.hash(event.entity.Password, SALT_WORK_FACTOR) 
    }

    async beforeUpdate(event: UpdateEvent<User>){
        // console.log(event)
        event.entity.Password = await bcrypt.hash(event.entity.Password, SALT_WORK_FACTOR) 
    }
}