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
    'SELECT user.id as id, user.surname as surname, user.name as name, user.email as email, user.profile_picture as profile_picture, user.birthday as birthday, user.bio as bio, pet.id as pet_id, pet.name as pet_name, pet.type as pet_type, pet.birthday as pet_birthday, pet.profile_picture as pet_profile_picture, pet.hobbies as pet_hobbies, pet.additional_info as pet_additional_info FROM user LEFT JOIN pet ON user.pet_id = pet.id WHERE email = ? AND password = ?'
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
  owner,
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

  const stmt2 = db.prepare('UPDATE user SET pet_id = ? WHERE email = ?');
  const info = stmt2.run(name, owner);
}
