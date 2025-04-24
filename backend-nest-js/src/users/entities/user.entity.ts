import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

// Este es el modelo de la tabla de usuarios en la base de datos, se utiliza para mapear
// los datos de la base de datos a objetos y viceversa.
// Se utiliza el decorador @Entity para indicar que esta clase es una entidad
// y el decorador @Column para indicar que un atributo de la clase es una columna
// de la tabla. El decorador @PrimaryGeneratedColumn indica que esta columna es la clave primaria
// y que su valor se generará automáticamente.
// El decorador @CreateDateColumn indica que esta columna se llenará automáticamente
// con la fecha y hora de creación del registro en la base de datos.
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullname: string;

  @Column({ type: 'int', default: 1, nullable: false })
  level: number;

  @Column({ type: 'int', default: 0, nullable: false })
  active: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdate: Date;
}
