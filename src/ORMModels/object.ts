import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';

  import {Project} from './project'

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
    Color: Object;

    @ManyToOne(type=>Project, proj => proj.ObjectList, {onDelete: 'CASCADE'})
    Project: Project;
    
}