import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
import { User } from './user';
import { DBObject } from './object'

@Entity()
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    Id: string;

    @Column()
    Description: string;

    @Column()
    DateModified: number

    @Column()
    ProjectName: string;

    @OneToMany(type=>DBObject, object => object.Project)
    ObjectList: DBObject[]

    @ManyToOne(type=>User, user=>user.Projects, {onDelete: 'CASCADE'})
    Owner: User
}