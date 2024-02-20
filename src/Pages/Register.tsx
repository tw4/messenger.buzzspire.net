import { Alert, Button, Card, Flex, Form, Image, Input } from 'antd';
import { RegisterForm } from '../Types/FormsType';
import { RegisterRequest } from '../API/Auth';
import { useState } from 'react';

export const Register: React.FC = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values: RegisterForm): void => {
    setIsLoading(true);
    RegisterRequest(values.UserName, values.Password, values.FullName).then((res) => {
      const regex = /^[\w-]+\.[\w-]+\.[\w-]+$/g.test(res.token);
      if (regex) {
        localStorage.setItem('username', values.UserName);
        localStorage.setItem('token', res.token);
        window.location.href = '/home';
      } else {
        setIsLoading(false);
        setErrorMessages(res.error);
        setIsError(true);
      }
    });
  };

  return (
    <Flex justify="center" vertical={true} align="center" style={{ height: '100vh' }}>
      <Card title="Register" hoverable={true}>
        <Flex justify='center' align='center' style={{margin: '20px'}}>
          <Image src='/logo.svg'  width={50}  />
        </Flex>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="UserName"
            rules={[{ required: true, message: 'Please input your Username!', min: 3, max: 20 }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="Password"
            rules={[{ required: true, message: 'Please input your Password!', min: 6, max: 20 }]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="FullName"
            rules={[{ required: true, message: 'Please input your Full Name!', min: 3, max: 20 }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          {isError && (
            <Alert
              style={{ margin: '10px' }}
              message="Error"
              description={errorMessages}
              type="error"
              showIcon
            />
          )}

          <Form.Item>
            <Flex gap="small" align="center">
              <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button">
                Register
              </Button>
              Or <a href="/">login now!</a>
            </Flex>
          </Form.Item>
        </Form>
      </Card>

    </Flex>
  );
};
