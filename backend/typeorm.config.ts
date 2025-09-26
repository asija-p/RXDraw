import { Drawing } from 'src/drawings/entities/drawing.entity';
import { ConnectionOptions } from 'typeorm';

export const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pop123',
  entities: [Drawing],
  synchronize: true,
};
