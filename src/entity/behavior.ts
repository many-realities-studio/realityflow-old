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
    public Name: string;

    @Column()
    public Trigger: string;
    
    @Column()
    public Target: string;
    
    // Chaining-related stuff
    @Column()
    public ChainOwner: string;

    @Column()
    public Index: number;
  }