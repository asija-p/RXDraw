import { Drawing } from 'src/drawings/models/drawing.entity';
import { Layer } from 'src/drawings/models/layer.entity';
import { Folder } from 'src/folders/models/folder.entity';
import { User } from 'src/users/models/user.entity';
import { ConnectionOptions } from 'typeorm';

export const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pop123',
  entities: [Drawing, Folder, User, Layer],
  synchronize: true,
  database: 'rxdraw',
};
