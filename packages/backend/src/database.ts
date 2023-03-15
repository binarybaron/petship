import Database from 'better-sqlite3';
import { Pet, User } from './main';

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

create table if not exists user_user_votes (
    user_id       integer not null,
    liked_user_id integer not null,
    positive      integer not null,
    constraint user_user_votes_pk
        primary key (user_id, liked_user_id)
);

create table if not exists user_pet_votes
(
    user_id      integer not null,
    liked_pet_id integer not null,
    positive     integer not null,
    constraint user_user_votes_pk
        primary key (user_id, liked_pet_id)
);
`);

export function createUser(email, password, surname, name): User {
  const stmt = db.prepare(
    'INSERT INTO user (email, password, surname, name) VALUES (?, ?, ?, ?)'
  );
  stmt.run(email, password, surname, name);
  return checkLogin(email, password);
}

export function getUser(user_id: number): User | null {
  const stmt = db.prepare(
    'SELECT user.id as id, user.surname as surname, user.name as name, user.email as email, user.profile_picture as profile_picture, user.birthday as birthday, user.bio as bio FROM user WHERE id = ?'
  );
  const info = stmt.get(user_id);
  const pet = getPet(info.id) || null;
  return {
    ...info,
    pet,
  };
}

export function checkLogin(email, password): User {
  const stmt = db.prepare(
    'SELECT user.id as id, user.surname as surname, user.name as name, user.email as email, user.profile_picture as profile_picture, user.birthday as birthday, user.bio as bio FROM user WHERE email = ? AND password = ?'
  );
  const info = stmt.get(email, password);
  if (info == null) {
    return null;
  }
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

  const stmt2 = db.prepare(
    'UPDATE user SET pet_id = last_insert_rowid() WHERE id = ?'
  );
  const info = stmt2.run(ownerId);
}

export function getPet(ownerId: number): Pet {
  const stmt = db.prepare(
    'SELECT pet.id as id, pet.name as name, pet.type as type, pet.birthday as birthday, pet.profile_picture as profile_picture, pet.hobbies as hobbies, pet.additional_info as additional_info FROM user INNER JOIN pet ON user.pet_id = pet.id WHERE user.id = ?'
  );
  const info = stmt.get(ownerId);
  return info;
}

export function getAllUsers(): User[] {
  const stmt = db.prepare(
    'SELECT user.id as id, user.surname as surname, user.name as name, user.email as email, user.profile_picture as profile_picture, user.birthday as birthday, user.bio as bio FROM user'
  );
  const info = stmt.all();
  return info;
}

export function addUserUserVote(
  user_id: number,
  liked_user_id: number,
  positive: boolean
) {
  const stmt = db.prepare(
    'INSERT or IGNORE INTO user_user_votes (user_id, liked_user_id, positive) VALUES (?, ?, ?)'
  );
  stmt.run(user_id, liked_user_id, positive ? 1 : 0);
}

export function getUserUserLikes(user_id: number): number[] {
  const stmt = db.prepare(
    'SELECT liked_user_id FROM user_user_votes WHERE user_id = ? AND positive = 1'
  );
  const info = stmt.all(user_id);
  return info.map((like) => like.liked_user_id);
}

export function getUserUserDisLikes(user_id: number): number[] {
  const stmt = db.prepare(
    'SELECT liked_user_id FROM user_user_votes WHERE user_id = ? AND positive = 0'
  );
  const info = stmt.all(user_id);
  return info.map((like) => like.liked_user_id);
}

export function getUserUserVotedOn(user_id: number): number[] {
  const stmt = db.prepare(
    'SELECT liked_user_id FROM user_user_votes WHERE user_id = ?'
  );
  const info = stmt.all(user_id);
  return info.map((like) => like.liked_user_id);
}

export function getAllPets(): Pet[] {
  const stmt = db.prepare(
    'SELECT pet.id as id, pet.name as name, pet.type as type, pet.birthday as birthday, pet.profile_picture as profile_picture, pet.hobbies as hobbies, pet.additional_info as additional_info FROM pet'
  );
  const info = stmt.all();
  return info;
}

export function addUserPetVote(
  user_id: number,
  liked_pet_id: number,
  positive: boolean
) {
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO user_pet_votes (user_id, liked_pet_id, positive) VALUES (?, ?, ?)'
  );
  stmt.run(user_id, liked_pet_id, positive ? 1 : 0);
}

export function getUserPetVotedOn(user_id: number): number[] {
  const stmt = db.prepare(
    'SELECT liked_pet_id FROM user_pet_votes WHERE user_id = ?'
  );
  const info = stmt.all(user_id);
  return info.map((like) => like.liked_pet_id);
}

function getOwnerOfPet(pet_id: number): User {
  const stmt = db.prepare('SELECT user.id as id FROM user WHERE pet_id = ?');
  const info = stmt.get(pet_id);
  return getUser(info.id);
}

// Find all pets, user combinations that satisfy the following conditions:
// 1. The user u1 has liked the pet p1 (table user_pet_votes)
// 2. The owner of the pet p1, u2, has liked the user u1 (table user_user_votes)
export function getUserPetMatches(): { buyer: User; owner: User; pet: Pet }[] {
  const stmt = db.prepare(`
    SELECT upv.user_id as userId, upv.liked_pet_id as petId FROM user_pet_votes upv
    WHERE upv.user_id IN (
        SELECT liked_user_id as matched_back_buyer
        FROM user_user_votes uuv
        WHERE uuv.user_id = (
            SELECT id as ownerId
            FROM user
            WHERE pet_id = upv.liked_pet_id
        ) AND positive = 1
    ) AND positive = 1
  `);
  const info = stmt.all().map((match) => {
    const owner = getOwnerOfPet(match.petId);
    const buyer = getUser(match.userId);
    const pet = getPet(match.petId);

    return {
      buyer,
      pet,
      owner,
    };
  });
  return info;
}
