import { Avatar, Flex, Tooltip, Typography } from 'antd';
import { FC } from 'react';

interface ChatItemProps {
  content: string;
  date: string;
  fullName: string;
  profilePicture: string;
  userName: string;
  currentUserName: string;
}

export const ChatItem: FC<ChatItemProps> = ({
                                              fullName,
                                              profilePicture,
                                              userName,
                                              content,
                                              date,
                                              currentUserName,
                                            }): JSX.Element => {
  return (
    <Flex
      style={{ padding: '10px' }}
      gap="small"
      align="end"
      justify={userName === currentUserName ? 'end' : 'start'}
    >
      <Flex vertical={true}>
        <Tooltip title={fullName}>
          {
            profilePicture !== '' ? (
                <Avatar
                  size={40}
                  src={`data:image/jpeg;base64, ${profilePicture}`}
                >
                  {userName}
                </Avatar>
              ) :
              <Avatar
                size={40}
                src={userName}
              >
                {userName[0]}
              </Avatar>
          }
        </Tooltip>

      </Flex>
      <Flex
        vertical={true}
        gap="small"
        style={{
          borderRadius: '20px 20px 20px 0px',
          padding: '10px',
          maxWidth: '50%',
          backgroundColor: userName === currentUserName ? '#00cc71' : '#434242',
        }}
      >
        <Typography.Text>{content}</Typography.Text>
        <Typography.Text style={{ textAlign: 'end' }} type="secondary">
          {new Date(date).toLocaleTimeString().slice(0, 5)}
        </Typography.Text>
      </Flex>
    </Flex>
  );
};
