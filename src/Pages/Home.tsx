import { Flex } from 'antd';
import { MainLayout } from '../layout/MainLayout';

export const Home = (): JSX.Element => {


  return (
    <Flex style={{ minHeight: '100vh', height: '100%' }}>
      <MainLayout key="0"></MainLayout>
    </Flex>
  );
};
