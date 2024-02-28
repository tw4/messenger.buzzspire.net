import { FC, useEffect, useState } from 'react';
import { Avatar, Flex, Typography, Popover } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ChatItem } from './ChatItem';
import { GetMessages } from '../API/Messages.ts';
import { Message, User } from '../Types/EntitysType';
import { Notification } from '../Types/NotificationType';
import { SearchUserByUserName } from '../API/User.ts';

interface ChatScreenProps {
  username: string;
  notification: Notification[];
}

export const ChatScreen: FC<ChatScreenProps> = ({ username, notification }): JSX.Element => {
  const [defaultUserName, setDefaultUserName] = useState<string>('');
  const [visitMessages, setVisitMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<User>();
  const [page, setPage] = useState<number>(1);
  const [profileImage, setProfileImage] = useState<string>('');
  const [myProfileImage, setMyProfileImage] = useState<string>('');

  useEffect(() => {
    const u = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (u && token) {
      setDefaultUserName(u);
      getMessage();
      SearchUserByUserName(token, username).then((res) => {
          setUserDetails(res);
          setProfileImage(`data:image/jpeg;base64, ${res.profilePicture}`);
        },
      );
      SearchUserByUserName(token, u).then((res) => {
          setMyProfileImage(`data:image/jpeg;base64, ${res.profilePicture}`);
        },
      );
    }

    const chatScreen = document.querySelector('.chatScreen');
    if (chatScreen) {
      chatScreen.scrollTop = chatScreen.scrollHeight;
    }
  }, [username]);

  const getMessage = (): void => {
    const token = localStorage.getItem('token');

    if (token) {
      GetMessages(token, username, 1).then((res) => {
        if (res) {
          setVisitMessages(res);
        }
      });
    }
  };

  const fetchMoreData = (): void => {
    const token = localStorage.getItem('token');
    if (token) {
      GetMessages(token, username, page + 1).then((res) => {
        if (res) {
          setVisitMessages([...visitMessages, ...res]);
          setPage(page + 1);
        } else {
          setHasMore(false);
        }
      });
    }
  };

  useEffect(() => {
    if (notification.find((n) => n.senderUserName === username)) {
      getMessage();
      setPage(1);
    }
  }, [notification]);

  const popOverContent = (
    userDetails && (
      <Flex vertical={true} style={{ height: 200, width: 300, position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#414141',
          height: '50px',
          width: '100%',
          borderRadius: '5px',
        }}></div>
        <Flex style={{
          width: 300,
          position: 'absolute',
          top: 25,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}>
          <Flex vertical={true} justify="center" align="center" gap="small" style={{ width: '100%' }}>
            {
              profileImage.length <= 30 ? <Avatar size="large">{username[0]}</Avatar> :
                <Avatar size="large" src={profileImage} />
            }
            <Typography.Title level={4}>{username}</Typography.Title>
            <Typography.Text>{userDetails.fullName}</Typography.Text>
            <Typography.Text>{userDetails.bio}</Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    )
  );

  return (
    <Flex vertical={true} style={{ minHeight: '90vh' }}>
      <Flex style={{ padding: '10px', borderBottomStyle: 'solid', borderBottomColor: 'grey', borderBottomWidth: '1px' }}
            gap="small">
        <Popover content={popOverContent} trigger="click">
          <Flex style={{ cursor: 'pointer' }} gap="middle">
            {
              profileImage.length <= 30 ? <Avatar size="large">{username[0]}</Avatar> :
                <Avatar size="large" src={profileImage} />
            } <Typography.Title level={4}>{username}</Typography.Title>
          </Flex>
        </Popover>
      </Flex>
      <Flex
        id="chatScreen"
        className="chatScreen"
        vertical={true}
        style={{ height: '100%', overflowY: 'auto' }}
      >
        <div
          id="scrollableDiv"
          style={{
            height: '80vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        >
          {/*Put the scroll bar always on the bottom*/}
          <InfiniteScroll
            dataLength={visitMessages.length}
            next={fetchMoreData}
            style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
            hasMore={hasMore}
            inverse={true}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {visitMessages.map((m, index) => (
              <ChatItem
                myProfileImage={myProfileImage}
                profileImage={profileImage}
                key={index}
                message={m}
                username={username}
                defaultUserName={defaultUserName}
              />
            ))}
          </InfiniteScroll>
        </div>
      </Flex>
    </Flex>
  );
};
