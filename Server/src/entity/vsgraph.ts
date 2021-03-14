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
    SerializedNodes: string;
    
    @Column()
    Edges: string;
    
    @Column()
    Groups: string;

    @Column()
    StackNodes: string;

    @Column()
    PinnedElements: string;

    @Column()
    ExposedParameters: string;

    @Column()
    StickyNotes: string;
    
    @Column()
    Position: string;
    
    @Column()
    Scale: string;
    
    @Column()
    References: string;

    @ManyToOne(type=>Project, proj => proj.VSGraphList, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    Project: Project;
}