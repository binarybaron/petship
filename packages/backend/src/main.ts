import express, { Request } from 'express';
import {
  addUserPetVote,
  addUserUserVote,
  checkLogin,
  createPet,
  createUser,
  getAllPets,
  getAllUsers,
  getUser,
  getUserPetMatches,
  getUserPetVotedOn,
  getUserUserVotedOn,
  updateBio,
  updateBirthday,
  updateProfilePicture,
} from './database';
import session from 'express-session';
import * as QueryString from 'querystring';

export interface User {
  id: number;
  email: string;
  surname: string;
  name: string;
  profile_picture: string;
  birthday: string;
  bio: string;
  pet: Pet | null;
}

export interface Pet {
  id: number;
  name: string;
  type: string;
  birthday: string;
  profile_picture: string;
  hobbies: string;
  additional_info: string;
}

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

const app = express();
app.use(
  express.json({
    limit: '50mb',
  })
);

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

function updateSessionData(
  req: Request<{}, any, any, any, Record<string, any>>
) {
  if (req.session.user) {
    req.session.user = getUser(req.session.user.id);
  }
}

app.post('/api/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const surname = req.body.surname;
  const name = req.body.name;

  try {
    const user = createUser(email, password, surname, name);
    console.log('Registered user', email, password, surname, name);

    req.session.user = user;
    res.send({ success: true });
  } catch (e) {
    res.send({ success: false, reason: 'Email already in use' });
  }
});

app.post('/api/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = checkLogin(email, password);
  if (user) {
    req.session.user = user;
    res.send({ success: true });
  } else {
    res.send({ success: false, reason: 'Wrong credentials' });
  }
});

app.post('/api/setupProfile', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const profilePicture = req.body.profilePicture;
  const profileDescription = req.body.profileDescription;
  const birthday = req.body.birthday;

  updateProfilePicture(user.email, profilePicture);
  updateBirthday(user.email, birthday);
  updateBio(user.email, profileDescription);

  console.log(
    'Setup profile',
    user,
    profilePicture,
    profileDescription,
    birthday
  );

  res.send({ success: true });
});

app.post('/api/petSetupProfile', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const name = req.body.name;
  const type = req.body.type;
  const age = req.body.age;
  const picture = req.body.picture;
  const hobbies = req.body.hobbies;
  const additionalInfo = req.body.additionalInfo;

  console.log(
    'Setup pet profile',
    user,
    name,
    type,
    age,
    picture,
    hobbies,
    additionalInfo
  );

  createPet(user.id, name, type, age, picture, hobbies, additionalInfo);

  res.send({ success: true });
});

app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.send({ success: true });
  });
});

app.get('/api/userInfo', (req, res) => {
  if (!req.session.user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  res.send({ success: true, user: req.session.user });
});

app.get('/api/allUsers', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
  const users = getAllUsers().slice(offset, offset + limit);
  res.send({ success: true, users });
});

app.get('/api/getNextUserUserVote', (req, res) => {
  if (!req.session.user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const user = req.session.user;
  const users = getAllUsers();
  const votedOnUsers = getUserUserVotedOn(user.id);
  const notVotedOnUsers = users.filter(
    (u) => !votedOnUsers.includes(u.id) && u.id !== user.id
  );
  const nextUser = notVotedOnUsers[0];

  res.send({ success: true, user: nextUser });
});

app.post('/api/addUserUserVote', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const likedUserId = req.body.ownerId as number;
  const positive = req.body.positive as boolean;

  addUserUserVote(user.id, likedUserId, positive);
  res.send({ success: true });
});

app.get('/api/getNextUserPetVote', (req, res) => {
  if (!req.session.user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const user = req.session.user;
  const pets = getAllPets();
  const votedOnPets = getUserPetVotedOn(user.id);
  const notVotedOnPets = pets.filter(
    (p) => !votedOnPets.includes(p.id) && (!user.pet || user.pet.id !== p.id)
  );
  const nextPet = notVotedOnPets[0];

  res.send({ success: true, pet: nextPet });
});

app.post('/api/addUserPetVote', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const likedPetId = req.body.petId as number;
  const positive = req.body.positive as boolean;

  addUserPetVote(user.id, likedPetId, positive);
  res.send({ success: true });
});

app.get('/api/getMatches', (req, res) => {
  if (!req.session.user) {
    res.status(401).send({ success: false, reason: 'Not logged in' });
    return;
  }
  updateSessionData(req);

  const user = req.session.user;

  const petMatches = getUserPetMatches().filter(
    (match) => match.buyer.id === user.id || match.owner.id === user.id
  );

  res.send({ success: true, matches: petMatches });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
