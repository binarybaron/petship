import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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

export interface Match {
  buyer: User;
  pet: Pet;
  owner: User;
}

export function useAccountInfo(): {
  isUserInfoLoading: boolean;
  userInfo: User | null;
  refetch: () => any;
} {
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useQuery('userInfo', () =>
    fetch('/api/userInfo').then((res) => res.json())
  );

  useEffect(() => {
    if (!isLoading && data !== null && data.success === false) {
      console.log('navigating to home because not logged in');
      navigate('/signin');
    }
  }, [isLoading, data, error]);

  if (isLoading) {
    return {
      isUserInfoLoading: true,
      userInfo: null,
      refetch,
    };
  }

  if (data) {
    if (data.success === true) {
      return { isUserInfoLoading: isLoading, userInfo: data.user, refetch };
    }
  }

  return {
    isUserInfoLoading: false,
    userInfo: null,
    refetch,
  };
}
