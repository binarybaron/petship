import { Container, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useState } from 'react';
import { QuestionAnswerOutlined } from '@mui/icons-material';
import { useMutation, useQuery } from 'react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MuiFileInput } from 'mui-file-input';
import { useNavigate } from 'react-router-dom';

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const questions: {
  question: string;
  shortQuestion: string;
  checkValid: (value: any) => boolean;
  type: 'text' | 'date' | 'file';
}[] = [
  {
    question: 'Please upload a profile picture, {name}',
    shortQuestion: 'Profile Picture',
    checkValid: (value: File | '') => value !== '',
    type: 'file',
  },
  {
    question: 'What is your age, {name}?',
    shortQuestion: 'Age',
    checkValid: (value) => typeof value === 'object' && value.isValid(),
    type: 'date',
  },
  {
    question: 'Tell us about yourself, {name}',
    shortQuestion: 'About',
    checkValid: (value: any) => typeof value === 'string' && value.length > 0,
    type: 'text',
  },
];

export default function SetupProfilePage() {
  const navigate = useNavigate();
  const {
    isLoading: isUserInfoLoading,
    error: userInfoError,
    data: userInfo,
  } = useQuery('userInfo', () =>
    fetch('/api/userinfo').then((res) => res.json())
  );

  async function submit() {
    await fetch('/api/setupProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profilePicture: await toBase64(answers[0]),
        birthday: answers[1],
        profileDescription: answers[2],
      }),
    });
    navigate('/home');
  }

  const [answers, setAnswers] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>('');

  async function postProfileInfo() {
    await submit();
  }

  if (answers.length >= questions.length) {
    postProfileInfo();
    return <>Loading</>;
  }

  const currentQuestion = questions[answers.length];
  let renderedLongQuestion = currentQuestion.question;

  if (!isUserInfoLoading && !userInfoError) {
    renderedLongQuestion = renderedLongQuestion.replace(
      '{name}',
      userInfo.name
    );
  }

  function onAnswerSubmit() {
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer('');
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <QuestionAnswerOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {renderedLongQuestion}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {currentQuestion.type === 'file' ? (
            <Box marginBottom="1rem">
              <MuiFileInput value={currentAnswer} onChange={setCurrentAnswer} />
            </Box>
          ) : null}
          {currentQuestion.type === 'date' ? (
            <Box marginBottom="1rem">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Basic example"
                  value={currentAnswer}
                  onChange={(newValue) => {
                    setCurrentAnswer(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          ) : null}
          {currentQuestion.type === 'text' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              maxRows={10}
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
              }}
            />
          ) : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={onAnswerSubmit}
            disabled={!currentQuestion.checkValid(currentAnswer)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
