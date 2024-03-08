export type User = {
  userName: string
  password: string
  fullName: string
  bio: string
  id: number
  profilePicture: string
}

export type Message = {
  content: string
  date : string
  fullName : string
  profilePicture: string
  receiverId: number
  senderId : number
  userName : string
}
