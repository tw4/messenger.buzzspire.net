import { FC } from 'react'
import { Card, Avatar, Typography, Flex, Badge } from 'antd'

interface MessageCardProps {
  message: string
  date: string
  userName: string
  notificationCount: number
  profileImage: string
}

export const MessageCard: FC<MessageCardProps> = ({
  message,
  userName,
  date,
  notificationCount,
  profileImage
}): JSX.Element => {
  const { Text } = Typography


  return (
    <Card hoverable style={{ margin: '3px', width: '100%', position: 'relative' }}>
      <Flex align="center" justify="space-between">
        <Flex gap="small">
          {
            profileImage.length <= 30 ? <Avatar size="large">{userName[0]}</Avatar> :
              <Avatar size="large" src={`data:image/jpeg;base64, ${profileImage}`}/>
          }
          <Flex vertical={true}>
            <Typography>{userName}</Typography>
            <Text style={{ color: 'gray' }}>
              {message.length > 15 ? message.slice(0, 15) + '...' : message}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="middle">
          <Typography style={{ color: 'gray' }}>
            {new Date(date).toLocaleTimeString().slice(0, 5)}
          </Typography>
          <Badge style={{backgroundColor: '#00FF8D'}} count={notificationCount} />
        </Flex>
      </Flex>
    </Card>
  )
}
