import {
    BaseEntity,
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  import {Project} from './project'

@Entity()
export class DBObject extends BaseEntity{

    @PrimaryGeneratedColumn()
    _id: number;  

    @PrimaryColumn()
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

    @ManyToOne(type=>Project, proj => proj.ObjectList, {cascade: true})
    Project: Project;
    
}