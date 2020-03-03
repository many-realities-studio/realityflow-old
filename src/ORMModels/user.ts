import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
  } from 'typeorm';
  
  
  import * as bcrypt from 'bcrypt';
  const SALT_WORK_FACTOR = 10;

  import {Project} from "./project"

  @Entity()
  export class User extends BaseEntity{
      @PrimaryGeneratedColumn()
      _id: number;

      @Column({unique: true})
      Username: string;

      @Column()
      Password: string

      @OneToMany(type => Project, project => project.Owner)
      Projects: Project[]
      
      @BeforeInsert()
      async beforeInsert(){
        this.Password = await bcrypt.hash(this.Password, SALT_WORK_FACTOR) 
      } 
  }