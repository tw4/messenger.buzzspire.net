import { useEffect, useState } from 'react';
import { MainLayout } from '../layout/MainLayout.tsx';
import { Flex, Typography, GetProp, UploadFile, UploadProps, Form, Input, Button, message, Avatar } from 'antd';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { API } from '../API';
import { SearchUserByUserName, UpdateUserBasicInfo, UpdateUserPassword } from '../API/User.ts';
import { ToastMessageTypeEnum } from '../Enums/ToastMessageTypeEnum.ts';
import { User } from '../Types/EntitysType.ts';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

type UserBasicInfoFieldType = {
  FullName?: string;
  Bio?: string;
};

type UserPasswordFieldType = {
  OldPassword?: string;
  NewPassword?: string;
  ConfirmPassword?: string;
};

export const Settings = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<User>();
  const [profileImage, setProfileImage] = useState<string>('');

  const [basicInfoForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    getUserDetails()
  },[])

  const getUserDetails = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      SearchUserByUserName(token, username).then((res) => {
          setUserDetails(res);
          setProfileImage(`data:image/jpeg;base64, ${res.profilePicture}`);
        },
      );
    }
  }

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const userBasicInfoFormSubmit = (values: UserBasicInfoFieldType) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);

    if (token && values.FullName && values.Bio) {
      UpdateUserBasicInfo(token, values.FullName, values.Bio).then((res) => {
        if (res) {
          toastMessage('Profile updated successfully', ToastMessageTypeEnum.Success);
          getUserDetails();
        }
      });
    }
    setIsLoading(false);
  };

  const userPasswordFormSubmit = (values: UserPasswordFieldType) => {
    const token = localStorage.getItem('token');

    setIsLoading(true);

    if (token && values.OldPassword && values.NewPassword == values.ConfirmPassword && values.NewPassword && values.ConfirmPassword) {

      UpdateUserPassword(token, values.OldPassword, values.NewPassword, values.ConfirmPassword).then((res) => {
          if (res) {
            toastMessage('Password updated successfully', ToastMessageTypeEnum.Success);
          } else {
            toastMessage('Password not updated', ToastMessageTypeEnum.Error);
          }
        },
      );
    } else {
      toastMessage('Password not updated', ToastMessageTypeEnum.Error);
    }

    setIsLoading(false);
  };

  const toastMessage = (content: string, type: ToastMessageTypeEnum) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  return (
    <MainLayout>
      {contextHolder}
      <Flex justify="center" align="center" vertical={true} gap='middle'>
        <Typography.Title level={2}>Settings</Typography.Title>

        <Flex vertical={true} style={{ height: 200, width: 300, position: 'relative', borderRadius: '20px', backgroundColor:'#515151' }}>
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
                profileImage.length <= 30 ? <Avatar size="large">{userDetails?.userName[0]}</Avatar> :
                  <Avatar size="large" src={profileImage} />
              }
              <Typography.Title level={4}>{userDetails?.userName}</Typography.Title>
              <Typography.Text>{userDetails?.fullName}</Typography.Text>
              <Typography.Text>{userDetails?.bio}</Typography.Text>
            </Flex>
          </Flex>
        </Flex>


        <Flex vertical={true}>
          <Typography.Title level={4}>Change Profile Picture</Typography.Title>
          <ImgCrop rotationSlider>
            <Upload
              name="file"
              headers={{
                token: localStorage.getItem('token') || '',
              }}
              action={`${API}/user/uploadProfilePicture`}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
          </ImgCrop>
        </Flex>

        <Form
          name="userBasicInfoForm"
          form={basicInfoForm}
          layout="vertical"
          onFinish={userBasicInfoFormSubmit}
        >
          <Form.Item<UserBasicInfoFieldType> label="Full Name" name="FullName">
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item<UserBasicInfoFieldType> label="bio" name="Bio">
            <Input placeholder="Enter bio" />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit">Update</Button>
          </Form.Item>
        </Form>

        <Form
          name="userPasswordForm"
          form={passwordForm}
          layout="vertical"
          onFinish={userPasswordFormSubmit}
        >
          <Form.Item<UserPasswordFieldType> label="Old Password" name="OldPassword"
                                            rules={[{
                                              required: true,
                                              message: 'Please input your Password!',
                                              min: 6,
                                              max: 20,
                                            }]}

          >
            <Input.Password placeholder="Enter Old Password" />
          </Form.Item>
          <Form.Item<UserPasswordFieldType> label="New Password" name="NewPassword"
                                            rules={[{
                                              required: true,
                                              message: 'Please input your Password!',
                                              min: 6,
                                              max: 20,
                                            }]}

          >
            <Input.Password placeholder="Enter New Password" />
          </Form.Item>
          <Form.Item<UserPasswordFieldType> label="Confirm Password" name="ConfirmPassword"
                                            rules={[{
                                              required: true,
                                              message: 'Please input your Password!',
                                              min: 6,
                                              max: 20,
                                            }]}
          >
            <Input.Password placeholder="Enter Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit">Update</Button>
          </Form.Item>
        </Form>

      </Flex>
    </MainLayout>
  );
};