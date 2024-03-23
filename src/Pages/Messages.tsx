import { MainLayout } from '../layout/MainLayout';
import { Flex, Button, Tooltip, Typography, message, Input, Popover } from 'antd';
import { MessageCard } from '../components/MessageCard';
import { GetAllLastMessagesResponse } from '../Types/MessageType';
import { useEffect, useState } from 'react';
import { GetAllLastMessages, SendMessage } from '../API/Messages.ts';
import { FileAddOutlined, SendOutlined } from '@ant-design/icons';
import { ChatScreen } from '../components/ChatScreen';
import { Notification } from '../Types/NotificationType';
import { User } from '../Types/EntitysType';
import { SearchUserByUserName } from '../API/User.ts';

export const Messages = (): JSX.Element => {
  const [lastMessagesResponse, setLastMessagesResponse] = useState<GetAllLastMessagesResponse[]>([]);
  const [toogleMessage, setToogleMessage] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [notification, setNotification] = useState<Notification[]>([]);
  const [text, setText] = useState<string>('');
  const [foundUser, setFoundUser] = useState<User>();
  const [lastmessageFilter, setLastMessageFilter] = useState<GetAllLastMessagesResponse[]>([]);

  const [messageApi, contextHolder] = message.useMessage();
  const { Search } = Input;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      GetAllLastMessages(token).then((res) => {
        if (res) {
          setLastMessagesResponse(res);
          setLastMessageFilter(res);
        }
      });
    }
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/message/ws`);

    // open connection
    ws.onopen = (): void => {
      setWebSocket(ws);
      console.log('connected');
      const request = {
        receiverUsername: '',
        token: token,
      };
      ws.send(JSON.stringify(request));
    };

    // listen for messages
    ws.onmessage = (msg): void => {
      const data: Notification = JSON.parse(msg.data);

      setNotification((prev) => [...prev, data]);

      if (token) {
        GetAllLastMessages(token).then((res) => {
          if (res) {
            setLastMessagesResponse(res);
            setLastMessageFilter(res);
          }
        });
      }
    };

    // close connection
    ws.onclose = (): void => {
      console.log('disconnected');
    };
  }, []);

  const handleToogleMessage = (username: string): void => {
    const token = localStorage.getItem('token');
    localStorage.setItem('selectedUser', username);

    if (!token) return;

    setToogleMessage(true);
    setSelectedUser(username);

    setNotification((prev) => prev.filter((not) => not.senderUserName !== username));
  };

  const handlerSearch = (value: string): void => {
    if (value === '') {
      setLastMessageFilter(lastMessagesResponse);
      return;
    }

    const filter = lastMessagesResponse.filter((message) => {
      return message.userName.toLowerCase().includes(value.toLowerCase());
    });
    setLastMessageFilter(filter);
  };

  const handlerSendMessage = (): void => {
    if (text === '' || selectedUser === '') return;
    const token = localStorage.getItem('token');
    if (!token) return;
    SendMessage(token, text, selectedUser).then((res) => {
      if (!res) {
        messageApi.open({
          type: 'error',
          content: 'Error to send message',
        });
      } else {
        setText('');
        GetAllLastMessages(token).then((res) => {
          if (res) {
            setLastMessagesResponse(res);
            setLastMessageFilter(res);
          }
        });
      }
    });

    if (webSocket) {
      const request = {
        receiverUsername: selectedUser,
        token: token,
      };

      webSocket.send(JSON.stringify(request));
    }
  };

  const handleSearchUser = (value: string): void => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username')
    ;
    if (token && username) {
      SearchUserByUserName(token, value).then((res) => {
        if (res.userName !== username && res.userName) {
          setFoundUser(res);
        } else {
          setFoundUser(undefined);
        }
      });
    }
  };

  const handleFoundUser = (): void => {
    if (foundUser) {
      handleToogleMessage(foundUser.userName);
    }
  };

  const popoverContent = (
    <>
      <Search placeholder="Search user" allowClear onSearch={(e) => handleSearchUser(e)} />
      {foundUser && (
        <div onClick={handleFoundUser}>
          <MessageCard
            profileImage={foundUser.profilePicture}
            message={''}
            date={''}
            userName={foundUser.userName}
            notificationCount={0}
          />
        </div>
      )}
    </>
  );

  return (
    <MainLayout>
      {contextHolder}
      <Flex>
        <Flex
          vertical={true}
          style={{ minWidth: '25vw', height: '100vh', padding: '10px', backgroundColor: 'rgba(32,32,32,0.64)' }}
        >
          <Flex justify="space-between">
            <Typography.Title level={4}>Messages</Typography.Title>
            <div>
              <Popover content={popoverContent} title="" trigger="click">
                <Tooltip title="Create a new message">
                  <Button shape="circle">
                    <FileAddOutlined />
                  </Button>
                </Tooltip>
              </Popover>
            </div>
          </Flex>
          <Search placeholder="Search" onSearch={(e) => handlerSearch(e)} />
          <Flex vertical={true} align="center" style={{ marginTop: '10px' }}>
            {lastmessageFilter.map((message, index) => {
              const username = localStorage.getItem('username');
              if (message.userName === username) return null;

              return (
                <div
                  key={index}
                  onClick={() => handleToogleMessage(message.userName)}
                  style={{ width: '100%' }}
                >
                  <MessageCard
                    key={index}
                    profileImage={message.profilePicture}
                    notificationCount={
                      notification.filter((not) => not.senderUserName === message.userName).length
                    }
                    message={message.lastMessage.content}
                    date={message.lastMessage.date}
                    userName={message.userName}
                  />
                </div>
              );
            })}
          </Flex>
        </Flex>

        <Flex vertical={true} style={{ width: '100%' }}>
          {toogleMessage && (
            <>
              <ChatScreen username={selectedUser} notification={notification} />
              <Flex style={{ padding: '10px' }} gap="small" align="center">
                <Input
                  autoFocus={true}
                  allowClear
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlerSendMessage();
                    }
                  }}
                />
                <Button shape="circle" onClick={handlerSendMessage}>
                  <SendOutlined />
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </MainLayout>
  );
};
