import {atom }  from "recoil";

interface User {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
  isLoding: boolean;
}

export const user = atom<User>({
  key: 'user',
  default: {
    user: {
        id: '',
        username: '',
        email: '',
        avatar: '',
    },
    isLoding: false,
  },
});