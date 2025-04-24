import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // Especificar explícitamente el nombre de la tabla
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullname: string;

  @Column({ type: 'int', default: 1, nullable: false })
  level: number;

  @Column({ type: 'int', default: 0, nullable: false })
  active: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdate: Date;
}
