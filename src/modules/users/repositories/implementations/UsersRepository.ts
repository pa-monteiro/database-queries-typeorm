import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userWithGames = await this.repository.findOne(
      {id: user_id},
      { relations: ["games"]}
    );

    if(!userWithGames) throw new Error("User not found");

    return userWithGames;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      SELECT * FROM users order by first_name ASC
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(
      `SELECT * FROM users WHERE LOWER(first_name)=LOWER('${first_name}') AND LOWER(last_name)=LOWER('${last_name}') LIMIT 1`
    );
  }
}
