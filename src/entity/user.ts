import {
    BaseEntity,
    Entity,
    Column,
    BeforeInsert,
    OneToMany,
    PrimaryColumn,
    BeforeUpdate,
  } from 'typeorm';
  
  
  import * as bcrypt from 'bcrypt';
  const SALT_WORK_FACTOR = 10;

  import {Project} from "./project"

  @Entity()
  export class User extends BaseEntity{

      @PrimaryColumn({unique: true})
      Username: string;

      @Column()
      Password: string

      @OneToMany(type => Project, project => project.Owner)
      Projects: Project[]
      
  }