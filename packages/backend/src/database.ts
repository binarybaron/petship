import Database from 'better-sqlite3';
import {Pet, User} from './main';

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
    name     text    not null,
    profile_picture text,
    birthday text,
    bio      text,
    pet_id integer
);

create table if not exists pet
(
    id       integer not null
        constraint pet_pk
            primary key autoincrement,
    name     text    not null,
    type     text    not null,
    birthday text    not null,
    profile_picture text not null,
    hobbies  text    not null,
    additional_info text not null
);
`);

export function createUser(email, password, surname, name): User {
  const stmt = db.prepare(
    'INSERT INTO user (email, password, surname, name) VALUES (?, ?, ?, ?)'
  );
  stmt.run(email, password, surname, name);
  return checkLogin(email, password);
}

export function checkLogin(email, password): User {
  const stmt = db.prepare(
    'SELECT user.id as id, user.surname as surname, user.name as name, user.email as email, user.profile_picture as profile_picture, user.birthday as birthday, user.bio as bio FROM user WHERE email = ? AND password = ?'
  );
  const info = stmt.get(email, password);
  const pet = getPet(info.id) || null;
  return {
    ...info,
    pet,
  };
}

export function updateProfilePicture(email, picture) {
  const stmt = db.prepare(
    'UPDATE user SET profile_picture = ? WHERE email = ?'
  );
  const info = stmt.run(picture, email);
  return info;
}

export function updateBirthday(email, birthday) {
  const stmt = db.prepare('UPDATE user SET birthday = ? WHERE email = ?');
  const info = stmt.run(birthday, email);
  return info;
}

export function updateBio(email, bio) {
  const stmt = db.prepare('UPDATE user SET bio = ? WHERE email = ?');
  const info = stmt.run(bio, email);
  return info;
}

export function createPet(
  ownerId: number,
  name,
  type,
  birthday,
  profile_picture,
  hobbies,
  additional_info
) {
  const stmt = db.prepare(
    'INSERT INTO pet (name, type, birthday, profile_picture, hobbies, additional_info) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(name, type, birthday, profile_picture, hobbies, additional_info);

  const stmt2 = db.prepare('UPDATE user SET pet_id = last_insert_rowid() WHERE id = ?');
  const info = stmt2.run(ownerId);
}

export function getPet(ownerId: number): Pet {
  const stmt = db.prepare(
    'SELECT pet.id as id, pet.name as name, pet.type as type, pet.birthday as birthday, pet.profile_picture as profile_picture, pet.hobbies as hobbies, pet.additional_info as additional_info FROM user INNER JOIN pet ON user.pet_id = pet.id WHERE user.id = ?'
  );
  const info = stmt.get(ownerId);
  return info;
}
