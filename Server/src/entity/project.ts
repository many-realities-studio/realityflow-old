import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
  } from 'typeorm';
import { User } from './user';
import { DBObject } from './object'
import { VSGraph } from './vsgraph';

@Entity()
export class Project extends BaseEntity{

    @PrimaryColumn({unique: true})
    Id: string;

    @Column()
    Description: string;

    @Column()
    DateModified: number

    @Column()
    ProjectName: string;

    @OneToMany(type => DBObject, object => object.Project)
    ObjectList: DBObject[]

    @OneToMany(type => VSGraph, vsGraph => vsGraph.Project)
    VSGraphList: VSGraph[]

    @ManyToOne(type => User, user => user.Projects, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    Owner: User
}