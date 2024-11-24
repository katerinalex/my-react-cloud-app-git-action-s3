/* eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useState } from 'react';
// Uncomment one of the following import options:
import AWS from 'aws-sdk'; // Import entire SDK (optional)
// import AWS from 'aws-sdk/global'; // Import global AWS namespace (recommended)
import S3 from 'aws-sdk/clients/s3'; // Import only the S3 client
import { useLocalStorage } from './useLocalStorage';


export const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showing, setShowing] = useState(false);
  const [files, setFiles] = useLocalStorage('files', []);
  // const [todos, setTodos] = useLocalStorage('files', []);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    // 'application/pdf',
    // 'video/mp4',
    // 'video/quicktime',
    // 'audio/mpeg',
    // 'audio/wav',
    // Add more supported types as needed
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
    if (event.target.files !== null) {
      const selectedFile = event.target.files[0];

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert('Invalid file type. Only images and PDFs are allowed.');
      }
    }
  };

  const uploadFile = async () => {
    setUploading(true);
    const S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET || '';
    const REGION = process.env.REACT_APP_AWS_REGION;

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file?.name || '',
      Body: file || '',
    };

    try {
      const upload = await s3.putObject(params).promise();

      console.log(upload);
      setUploading(false);
      // alert('File uploaded successfully.');
    } catch (error: any) {
      console.error(error);
      setUploading(false);
      // alert(`Error uploading file: ${error.message}`); // Inform user about the error
    }
  };

  const showFile = async () => {
    setShowing(true);
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION
    });

    const bucketName = process.env.REACT_APP_AWS_S3_BUCKET || '';

    // List objects in the bucket
    s3.listObjectsV2({ Bucket: bucketName }, (err:any, data:any) => {
        if (err) {
            // console.error("Error fetching objects:", err);
        } else {
          if (data === undefined) {
            // console.log('No data')
          } else {
            const array:string[] = [];
            data.Contents.forEach((item:any) => {
              // setFiles((f:string[] )=> [...f , item.Key]);
              array.push(item.Key);
              // console.log(item.Key);
            });
            setFiles(array);
          }

        }
    });
    setShowing(false);
  };

  return (
    <>
      <div className="">
        <input type="file" required onChange={handleFileChange} />
        <button onClick={uploadFile}>{uploading ? 'Uploading...' : 'Upload File'}</button>
        <button onClick={showFile}>{showing ? 'Showing...' : 'Show All Saved Files'}</button>
        {files.length > 0 && (
          <div>
            {files.map((el:string, index:number) => (
              <img key={index} src={`https://my-react-website-s3-upload.s3.eu-north-1.amazonaws.com/${el}`} alt="awsImage" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
