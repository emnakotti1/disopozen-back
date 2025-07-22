import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path'; 


import { fileURLToPath } from 'url';
import { dirname } from 'path';



export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
 entities: [path.join(process.cwd(), 'src/**/*.entity.{ts,js}')],
  migrations: [path.join(process.cwd(), 'src/migrations/*.{ts,js}')],
});
