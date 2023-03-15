import { Pet } from './hooks';
import { useQuery } from 'react-query';
import { Box, Container } from '@mui/material';
import BackToHomeButton from './backToHomeButton';
import { PersonaCard } from './userCard';

export default function FindPetFeedPage() {
  const {
    isLoading: isVotePetsLoading,
    data: votePet,
    refetch,
  } = useQuery('getNextUserPetVote', async () => {
    const response = await fetch('/api/getNextUserPetVote');
    const data = await response.json();
    return data.pet as Pet;
  });

  if (isVotePetsLoading) {
    return <>Loading...</>;
  }

  async function submitPetVote(like: boolean) {
    if (votePet === undefined) {
      return;
    }

    await fetch(`/api/addUserPetVote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        petId: votePet.id,
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
        {votePet ? (
          <PersonaCard
            onLike={() => submitPetVote(true)}
            onDislike={() => submitPetVote(false)}
            bio={
              <>
                Hobbies: {votePet.hobbies}
                <br />
                Additional info: {votePet.additional_info}
              </>
            }
            fullName={`${votePet.name} (${votePet.type})`}
            profilePicture={votePet.profile_picture}
          />
        ) : (
          <>No pets to vote on left</>
        )}
        <BackToHomeButton />
      </Box>
    </Container>
  );
}
