import { User } from './hooks';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { Favorite, HeartBroken } from '@mui/icons-material';
import { ReactNode } from 'react';

export function PersonaCard({
  onLike,
  onDislike,
  fullName,
  bio,
  profilePicture,
}: {
  profilePicture: string;
  fullName: string;
  bio: ReactNode;
  onLike: () => void;
  onDislike: () => void;
}) {
  return (
    <Card>
      <CardMedia
        component="img"
        image={profilePicture}
        sx={{
          maxHeight: 500,
          maxWidth: 500,
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bio}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton color="success" component="label" onClick={onLike}>
          <Favorite />
        </IconButton>
        <IconButton color="error" component="label" onClick={onDislike}>
          <HeartBroken />
        </IconButton>
      </CardActions>
    </Card>
  );
}
