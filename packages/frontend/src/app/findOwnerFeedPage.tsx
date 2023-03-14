import { useQuery } from 'react-query';
import { User } from './hooks';
import { Box, Container } from '@mui/material';
import { PersonaCard } from './userCard';
import BackToHomeButton from './backToHomeButton';

export default function FindOwnerFeedPage() {
  const {
    isLoading: isVoteUsersLoading,
    data: voteUser,
    refetch,
  } = useQuery('getNextUserUserVote', async () => {
    const response = await fetch('/api/getNextUserUserVote');
    const data = await response.json();
    return data.user as User;
  });

  if (isVoteUsersLoading) {
    return <>Loading...</>;
  }

  async function submitUserVote(like: boolean) {
    if (voteUser === undefined) {
      return;
    }

    await fetch(`/api/addUserUserVote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: voteUser.id,
        positive: like,
      }),
    });

    refetch();
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {voteUser ? (
          <PersonaCard
            onLike={() => submitUserVote(true)}
            onDislike={() => submitUserVote(false)}
            profilePicture={voteUser.profile_picture}
            fullName={`${voteUser.surname} ${voteUser.name}`}
            bio={voteUser.bio}
          />
        ) : (
          <>No vote users left</>
        )}
        <BackToHomeButton />
      </Box>
    </Container>
  );
}
