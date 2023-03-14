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
import { useAccountInfo } from './hooks';

const toBase64 = (file: File) =>
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
    question: 'What is the name of your pet, {name}?',
    shortQuestion: 'Name',
    checkValid: (value) => typeof value === 'string' && value.length > 2,
    type: 'text',
  },
  {
    question: 'What kind of pet is it, please specify the race?',
    shortQuestion: 'Name',
    checkValid: (value) => typeof value === 'string' && value.length > 2,
    type: 'text',
  },
  {
    question: 'When was your pet born?',
    shortQuestion: 'Age',
    checkValid: (value) => typeof value === 'object' && value.isValid(),
    type: 'date',
  },
  {
    question: 'Please upload a picture of your pet, {name}',
    shortQuestion: 'Pictures',
    checkValid: (value: File | '') => value !== '',
    type: 'file',
  },
  {
    question: 'What are your pets hobbies?',
    shortQuestion: 'Hobbies, favourite games, etc.',
    checkValid: (value: any) => typeof value === 'string' && value.length > 0,
    type: 'text',
  },
  {
    question: 'Any additional information about your pet? Any special needs?',
    shortQuestion: 'Allergies, special needs, disabilities etc.',
    checkValid: (value: any) => typeof value === 'string' && value.length > 0,
    type: 'text',
  },
];

export default function PetSetupProfilePage() {
  const navigate = useNavigate();
  const { isUserInfoLoading, userInfo } = useAccountInfo();

  async function submit(ans: any[]) {
    const response = await fetch('/api/petSetupProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: ans[0],
        type: ans[1],
        age: ans[2],
        picture: await toBase64(ans[3]),
        hobbies: ans[4],
        additionalInfo: ans[5],
      }),
    });
    const data = await response.json();
    if (data.success) {
      navigate('/find-owner-feed');
    } else {
      alert(data.reason);
    }
  }

  const [answers, setAnswers] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>('');

  async function postProfileInfo(answers: any[]) {
    await submit(answers);
  }

  if (answers.length >= questions.length) {
    return <>Loading... {answers[3].name}</>;
  }

  const currentQuestion = questions[answers.length];
  let renderedLongQuestion = currentQuestion.question;

  if (!isUserInfoLoading && userInfo !== null) {
    renderedLongQuestion = renderedLongQuestion.replace(
      '{name}',
      userInfo.name
    );
  }

  function onAnswerSubmit() {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (newAnswers.length >= questions.length) {
      postProfileInfo(newAnswers);
    }
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
              <MuiFileInput
                value={currentAnswer}
                onChange={setCurrentAnswer}
                multiple={false}
              />
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
