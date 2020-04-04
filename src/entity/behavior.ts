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
  export class Behavior extends BaseEntity{
    // ignore, for the most part
    @PrimaryGeneratedColumn()
    public _id: number;

    // actual behavior stuff
    @Column()
    public Id: string;

    @Column()
    public TypeOfTrigger: string;

    @Column()
    public Trigger: string;
    
    @Column()
    public Target: string;

    @Column()
    public Project: string;

    @Column()
    public NextBehavior: string;

    @Column()
    public ActionParameters: string;
  }