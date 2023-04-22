import React, { useMemo, useCallback } from "react";
import { Box, FormField, Text, TextInput } from "grommet";
import { Close } from "grommet-icons";
import { useFormikContext } from "formik";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

import ImageCrop from "./ImageCrop";
import {
  FileList,
  FileSelectedPreview,
  ImagePreview,
  UploadZone,
  VideoPreview
} from "./utils";

const UploadComponent = ({
  accept,
  multiple,
  maxSize,
  imageCropAspect,
  fixedAspect
}) => {
  const {
    values,
    setFieldValue,
    touched,
    errors,
    handleBlur,
    handleChange,
    isSubmitting
  } = useFormikContext();

  // Define array for initial values
  const onDrop = useCallback(
    (acceptedFiles) => {
      let array = [];
      if (acceptedFiles.length > 0) {
        array = [...acceptedFiles];
      }
      setFieldValue("files", array);
      setFieldValue(
        "file_name",
        array.length === 1 ? array[0].name.split(".")[0] : ""
      );
      setFieldValue(
        "ext",
        array.length === 1 ? array[0].name.split(".")[1] : ""
      );
    },
    [setFieldValue]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    multiple,
    accept,
    maxSize,
    onDrop
  });

  // Define file rejections in string for error
  const validationError = useMemo(() => {
    let exArray = fileRejections.map((ex) => {
      let errMsgArr = ex.errors.map((err) => {
        return err.message;
      });
      let errMsgStr = errMsgArr.join(", ");
      return `The file "${ex.file.name}" cannot be uploaded as ${errMsgStr}`;
    });
    return exArray;
  }, [fileRejections]);

  const removeFile = (files, selectedFile, setFieldValue) => {
    let fileArr = [...files];
    fileArr = fileArr.filter((i) => i !== selectedFile);
    setFieldValue("files", fileArr);
    if (fileArr.length <= 1) {
      setFieldValue(
        "file_name",
        fileArr.length === 1 ? fileArr[0].name.split(".")[0] : ""
      );
      setFieldValue(
        "ext",
        fileArr.length === 1 ? fileArr[0].name.split(".")[1] : ""
      );
    }
  };
  return (
    <>
      {validationError.length > 0 && (
        <Box overflow="auto" height="60px" margin={{ bottom: "small" }}>
          {validationError.map((text) => {
            return (
              <Text
                height={{ min: "32px" }}
                size="10px"
                color="red"
                margin={{ bottom: "small" }}
              >
                {text.replace("100000000 bytes", "100 MB.")}
              </Text>
            );
          })}
        </Box>
      )}
      {values.files.length === 0 ? (
        // No file chosen yet, choose files(s)
        <UploadZone getRootProps={getRootProps} getInputProps={getInputProps} />
      ) : values.files.length === 1 ? (
        // One file chosen, display editable title
        <Box justifyContent="center">
          <Box basis="full" justify="stretch" direction="row">
            <FormField
              name={`file_name`}
              label="File Name"
              error={touched.file_name && errors.file_name}
              width="100%"
            >
              <TextInput
                name={"file_name"}
                placeholder="File Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.file_name}
                disabled={isSubmitting}
              />
            </FormField>
            <Box
              direction="column"
              justify="center"
              pad={{ left: "small", right: "small" }}
              onClick={() =>
                removeFile(values.files, values.files[0], setFieldValue)
              }
            >
              <Close size="16px" />
            </Box>
          </Box>
          {values.ext === "jpg" ||
          values.ext === "jpeg" ||
          values.ext === "webp" ||
          values.ext === "png" ? (
            imageCropAspect ? (
              <ImageCrop
                image={values.files[0]}
                aspect={imageCropAspect}
                fixedAspect={fixedAspect}
                setFieldValue={setFieldValue}
                isSubmitting={isSubmitting}
              />
            ) : (
              // Preview Image
              <ImagePreview file={values.files[0]} />
            )
          ) : values.ext === "mp4" || values.ext === "webm" ? (
            // Preview Video
            <VideoPreview file={values.files[0]} />
          ) : (
            // File has been selected confirmation
            <FileSelectedPreview />
          )}
        </Box>
      ) : values.files.length > 1 ? (
        // List of files (multiple only)
        <FileList
          files={values.files}
          removeFile={removeFile}
          setFieldValue={setFieldValue}
        />
      ) : null}
    </>
  );
};

UploadComponent.propTypes = {
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  imageCropAspect: PropTypes.number,
  fixedAspect: PropTypes.bool,
  maxSize: PropTypes.any
};

// TODO - Define these
UploadComponent.defaultProps = {
  accept: "",
  title: "Upload File",
  multiple: false,
  imageCropAspect: null,
  fixedAspect: false,
  maxSize: 1e8
};

export default UploadComponent;
