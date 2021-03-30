import {
    BaseEntity,
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';

import {Project} from './project'
// import { Behaviour } from './behaviour';

@Entity()
export class VSGraph extends BaseEntity{

    //TODO: Graph properties go here
    @PrimaryGeneratedColumn()
    _id: number;  

    @Column()
    Id: string;

    @Column()
    Name: string;

    @Column()
    serializedNodes: string;
    
    @Column()
    edges: string;
    
    @Column()
    groups: string;

    @Column()
    stackNodes: string;

    @Column()
    pinnedElements: string;

    @Column()
    exposedParameters: string;

    @Column()
    stickyNotes: string;
    
    @Column()
    position: string;
    
    @Column()
    scale: string;
    
    @Column()
    references: string;

    @ManyToOne(type=>Project, proj => proj.VSGraphList, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    Project: Project;
}