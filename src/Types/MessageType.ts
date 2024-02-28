import { Message } from './EntitysType.ts';

export type LastMessage = {
  userName: string
  userId: number
  lastMessage: Message
  profilePicture: string
}

export type GetAllLastMessagesResponse = LastMessage
