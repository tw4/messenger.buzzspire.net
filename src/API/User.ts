import { User } from '../Types/EntitysType'
import {API} from './index.ts';

export const SearchUserByUserName = async (token: string, username: string): Promise<User> => {
  const respoense = await fetch(`${API}/User/search/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: token
    }
  })
  return respoense.json()
}

export const UploadProfilePicture = async (token: string, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const respoense = await fetch(`${API}/User/uploadProfilePicture`, {
    method: 'POST',
    headers: {
      token: token
    },
    body: formData
  })
  return respoense.json()
}
