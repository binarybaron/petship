import Database from 'better-sqlite3';
import { User } from './main';

/*
DATABASE DEFINITION
 */

const db = new Database('database.sqlite');

db.exec(`
create table if not exists user
(
    id       integer not null
        constraint user_pk
            primary key autoincrement,
    email    text    not null unique,
    password text    not null,
    surname  text    not null,
    name     text    not null
);
`);

export function createUser(email, password, surname, name): User {
  const stmt = db.prepare(
    'INSERT INTO user (email, password, surname, name) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(email, password, surname, name);
  return checkLogin(email, password);
}

export function checkLogin(email, password): User {
  const stmt = db.prepare(
    'SELECT id, surname, name, email FROM user WHERE email = ? AND password = ?'
  );
  const info = stmt.get(email, password);
  return info;
}
