import {
    BaseEntity,
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
import { DBObject } from './object';


  @Entity()
  export class Behaviour extends BaseEntity{
    // ignore, for the most part
    @PrimaryGeneratedColumn()
    public _id: number;

    // actual behavior stuff
    @Column()
    public Id: string;

    @Column()
    public TypeOfTrigger: string;

    @Column()
    public TriggerObjectId: string;
    
    @Column()
    public TargetObjectId: string;

    @Column()
    public ProjectId: string;

    @Column()
    public NextBehaviour: string;

    @Column()
    public Action: string;
  }