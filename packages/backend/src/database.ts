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
    'SELECT id, surname, name, email, profile_picture, birthday, bio FROM user WHERE email = ? AND password = ?'
  );
  const info = stmt.get(email, password);
  return info;
}

export function updateProfilePicture(email, picture) {
  const stmt = db.prepare(
    'UPDATE user SET profile_picture = ? WHERE email = ?'
  );
  const info = stmt.run(picture, email);
  return info;
}

export function updateBirthday(email, birthday) {
  const stmt = db.prepare(
    'UPDATE user SET birthday = ? WHERE email = ?'
  );
  const info = stmt.run(birthday, email);
  return info;
}

export function updateBio(email, bio) {
  const stmt = db.prepare(
    'UPDATE user SET bio = ? WHERE email = ?'
  );
  const info = stmt.run(bio, email);
  return info;
}
