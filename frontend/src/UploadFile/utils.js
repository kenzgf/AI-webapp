import { Box, Button, Card, CardBody, Image, Text, Video } from "grommet";
import { Close, Upload, Validate } from "grommet-icons";
import styled from "styled-components";
import React, { useState } from 'react';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
`;

const DropZone = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  &:focus {
    border-color: #2196f3;
    box-shadow: none;
  }
`;

const CropContainer = styled(Box)`
  position: relative;
  height: 283px;
  width: 100%;
  position: relative;
  background: #333;
  pointer-events: ${(props) => (props.disabled === true ? "none" : "initial")};
`;

const UploadingBox = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
`;

const getCroppedImg = (image, crop, filename, callback) => {
  const canvas = document.createElement("canvas");
  const scaleX = crop.imageNaturalWidth / crop.imageWidth;
  const scaleY = crop.imageNaturalHeight / crop.imageHeight;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  const reader = new FileReader();
  canvas.toBlob((blob) => {
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      callback(dataURLtoFile(reader.result, filename));
    };
  });
};

const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  let croppedImage = new File([u8arr], filename, { type: mime });
  // console.log(croppedImage);
  return croppedImage;
};

const UploadZone = ({ getRootProps, getInputProps }) => {
  return (
    <Box direction="row-responsive" justify="center" align="center">
      <Container>
        <DropZone height="large" {...getRootProps({ className: "dropzone" })}>
          <Upload color="#bdbdbd" />
          <input accept=".pdf" {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </DropZone>
      </Container>
    </Box>
  );
};

const LayerHeader = ({ setLayer, title }) => {
  return (
    <Box
      flex={{ shrink: 0 }}
      justify="between"
      direction="row"
      pad={{
        top: "medium",
        left: "medium",
        right: "medium",
        bottom: "small"
      }}
    >
      <Text size="21px">{title}</Text>
      <Box pad={{ top: "xsmall" }} onClick={() => setLayer(false)}>
        <Close size="20px" />
      </Box>
    </Box>
  );
};

const LayerFooter = ({ setLayer, errors, files, isSubmitting }) => {
  return (
    <Box
      as="footer"
      gap="small"
      direction="row"
      align="center"
      justify="end"
      pad={{ top: "medium", bottom: "small" }}
    >
      <Text as="div" color="status-critical">
        {errors.non_field}
      </Text>
      <Button
        onClick={() => setLayer(false)}
        alignSelf="end"
        margin={{ vertical: "small" }}
        label="Close"
        primary
      />
      <Button
        type="submit"
        alignSelf="end"
        margin={{ vertical: "small" }}
        label={isSubmitting === true ? "Please Wait..." : "Upload"}
        primary
        disabled={files.length < 1 || isSubmitting === true}
      />
    </Box>
  );
};

const FileSelectedPreview = () => {
  return (
    <Box direction="row-responsive" justify="center" align="center">
      <Container>
        <DropZone height="large">
          <Validate color="#1DB954" />
          <p>File has been selected. Click Upload to proceed.</p>
        </DropZone>
      </Container>
    </Box>
  );
};

const VideoPreview = ({ file }) => {
  return (
    <Box direction="row-responsive" justify="center" align="center">
      <Container>
        <DropZone height="medium">
          <Video fit="contain" fill autoPlay>
            <source src={URL.createObjectURL(file)} type={file.type} />
          </Video>
        </DropZone>
      </Container>
    </Box>
  );
};

const ImagePreview = ({ file }) => {
  return (
    <Box direction="row-responsive" justify="center" align="center">
      <Container>
        <DropZone height="medium">
          <Image
            fallback="//v2.grommet.io/assets/IMG_4245.jpg"
            src={URL.createObjectURL(file)}
            fit="contain"
            fill
          />
        </DropZone>
      </Container>
    </Box>
  );
};

const FileList = ({ files, removeFile, setFieldValue }) => {
  return (
    <Box overflow="auto" height="300px">
      {files.map((file, index) => {
        return (
          <Box margin="small" height={{ min: "32px" }} key={index}>
            <Card pad="small" gap="medium" background="light-3">
              <CardBody>
                <Box justify="between" direction="row">
                  <Text size="10px">{file.name}</Text>
                  <Box onClick={() => removeFile(files, file, setFieldValue)}>
                    <Close size="16px" />
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};

function Popup(props) {
  const [isOpen, setIsOpen] = useState(true);

  function handleClose() {
    setIsOpen(false);
  }

  if (!isOpen) {
    return null; // if the popup is closed, don't render anything
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-text">{props}</div>
        <button className="popup-close" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

export {
  dataURLtoFile,
  getCroppedImg,
  CropContainer,
  FileList,
  FileSelectedPreview,
  ImagePreview,
  LayerFooter,
  LayerHeader,
  UploadingBox,
  UploadZone,
  VideoPreview,
  Popup
};
