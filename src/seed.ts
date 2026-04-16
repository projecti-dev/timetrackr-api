import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Mahri1996.',
  database: 'timetrackr',
  entities: [User],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const users = [
    { username: 'mahri', password: 'mahri123', displayName: 'Mahri' },
    { username: 'admin', password: 'admin123', displayName: 'Admin' },
  ];

  for (const u of users) {
    const exists = await userRepo.findOne({ where: { username: u.username } });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await userRepo.save(userRepo.create({ ...u, password: hashed }));
      console.log(`Created user: ${u.username}`);
    } else {
      console.log(`User already exists: ${u.username}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seed complete!');
}

seed();
