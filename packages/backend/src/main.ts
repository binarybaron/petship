import express from 'express';
import {checkLogin, createUser, updateBio, updateBirthday, updateProfilePicture} from './database';
import session from 'express-session';

export interface User {
  id: number;
  email: string;
  surname: string;
  name: string;
}

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

const app = express();
app.use(express.json({
  limit: '50mb'
}));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

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
});

app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.send({ success: true });
  });
});

app.get('/api/userinfo', (req, res) => {
  res.send(req.session.user);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
