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
import { Behaviour } from './behaviour';

@Entity()
export class DBObject extends BaseEntity{

    @PrimaryGeneratedColumn()
    _id: number;  

    @Column()
    Id: string;

    @Column()
    Name: string;
    
    @Column()
    X: number;
    
    @Column()
    Y: number;
    
    @Column()
    Z: number;
    
    @Column()
    Q_x: number;
    
    @Column()
    Q_y: number;
    
    @Column()
    Q_z: number;
    
    @Column()
    Q_w: number;
    
    @Column()
    S_x: number;
    
    @Column()
    S_y: number;
    
    @Column()
    S_z: number;
    
    @Column()
    R: number;

    @Column()
    G: number

    @Column()
    B: number

    @Column()
    A: number

    @Column()
    Prefab:string

    @ManyToOne(type=>Project, proj => proj.ObjectList, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    Project: Project;
    
}