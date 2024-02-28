import { useState } from 'react';
import { MainLayout } from '../layout/MainLayout.tsx';
import { Flex, Typography, GetProp, UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { API } from '../API';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const Settings = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  return (
    <MainLayout key="2">
      <Flex justify="center" align="center" vertical={true}>
        <Typography.Title level={2}>Settings</Typography.Title>
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

      </Flex>
    </MainLayout>
  );
};