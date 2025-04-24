import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// Este modelo representa la tabla de usuarios en la base de datos
// y define las propiedades de cada usuario.
// Se utiliza la librería TypeORM para interactuar con la base de datos
// y se define la entidad User con sus respectivas columnas y tipos de datos.
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
