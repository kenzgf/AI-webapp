import React, { useContext, useMemo, useState } from "react";
import {
  FormField,
  Box,
  Text,
  Layer,
  ResponsiveContext,
  TextArea
} from "grommet";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";

import UploadComponent from "./UploadComponent";
import { getCroppedImg, LayerFooter, LayerHeader, Popup } from "./utils";
import axios from "axios";

const rootURL = process.env.PORT;
const emojis = ["👿", "🤢" , "😱" , "😊" , "😐 ", "😔" , "😲" ];
function indexOfGreatest(arr) {
  let ret = 0;
  let g = 0;
  for (let i = 0; i < 7; i++) {
    if (arr[i] > g) {
      ret = i;
      g = arr[i];
    }
  }
  return ret;
}
const UploadFile = ({
  setLayer,
  eventEmitter,
  uploadFile,
  accept,
  title,
  imageCropAspect,
  showAddNotes,
  initialNote,
  ...rest
}) => {
  const size = useContext(ResponsiveContext);
  // Define file types in string
  const fileTypes = useMemo(() => {
    let string = `${accept}`;
    string = string.toUpperCase().split(",").join(" ");
    if (string.length < 1) string = "All.";
    return string;
  }, [accept]);

  //TODO - complete this
  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    setErrors({});
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', values.files[0]);
      const response = await axios.post(`/image`, formData);
      const pred = response.data.prediction[0];
      alert('This person is ' + emojis[indexOfGreatest(pred)] + '!\n' + 
            'In case this prediction is wrong, here is what the model actually outputted:\n' + 
            emojis[0] + ': ' + Number(pred[0]*100).toFixed(2) + '%\n' + 
            emojis[1] + ': ' + Number(pred[1]*100).toFixed(2) + '%\n' + 
            emojis[2] + ': ' + Number(pred[2]*100).toFixed(2) + '%\n' + 
            emojis[3] + ': ' + Number(pred[3]*100).toFixed(2) + '%\n' + 
            emojis[4] + ': ' + Number(pred[4]*100).toFixed(2) + '%\n' + 
            emojis[5] + ': ' + Number(pred[5]*100).toFixed(2) + '%\n' + 
            emojis[6] + ': ' + Number(pred[6]*100).toFixed(2) + '%\n');

    } catch (e) {
      console.log(e.message);
      alert('Something went wrong... Please check your input and try again!')
      if (e.errors) setErrors(e.errors);
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape({
    // file_name: Yup.string().required('File Name is required'),
  });

  return (
    <Layer
      position="center"
      onClickOutside={() => setLayer(false)}
      onEsc={() => setLayer(false)}
      margin="medium"
    >
      <Box width={size !== "small" ? "38rem" : "100%"}>
        <LayerHeader title={title} setLayer={setLayer} />
        <hr
          style={{ borderColor: "#ec4523", height: "0.1px", width: "100%" }}
        />
        <Box overflow={{ vertical: "auto", horizontal: "hidden" }}>
          <Formik
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            initialValues={{
              files: [],
              file_name: "",
              ext: "",
              croppedAreaPixels: {},
              note: initialNote || ""
            }}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue
            }) => (
              <form onSubmit={handleSubmit}>
                <Text as="div" color="status-critical">
                  {errors.title}
                </Text>
                <Box pad={{ vertical: "medium", horizontal: "large" }}>
                  <Box margin={{ bottom: "medium" }}>
                    <Text size="10px" margin={{ bottom: "medium" }}>
                      Accepted file types are: {fileTypes}
                    </Text>{" "}
                    {/* Rejections are displayed here */}
                    <UploadComponent
                      fileTypes={fileTypes}
                      accept={accept}
                      imageCropAspect={imageCropAspect}
                      {...rest}
                    />
                  </Box>
                  {showAddNotes && (
                    <Box>
                      <FormField
                        name="note"
                        error={touched.note && errors.note}
                      >
                        <Box height="small" margin={{ top: "small" }}>
                          <TextArea
                            fill
                            plain
                            name="note"
                            resize={false}
                            placeholder="Type here to add notes"
                            value={values.note}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Box>
                      </FormField>
                    </Box>
                  )}
                  <LayerFooter
                    setLayer={setLayer}
                    errors={errors}
                    files={values.files}
                    isSubmitting={isSubmitting}
                  />
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Layer>
  );
};

UploadFile.propTypes = {
  accept: PropTypes.string,
  title: PropTypes.string,
  uploadFile: PropTypes.func,
  imageCropAspect: PropTypes.number,
  showAddNotes: PropTypes.bool,
  initialNote: PropTypes.string,
  setLayer: PropTypes.func,
  eventEmitter: PropTypes.object
};

UploadFile.defaultProps = {
  accept: "",
  title: "Upload File",
  uploadFile: () => alert("FORM SuBMIT"),
  imageCropAspect: null,
  showAddNotes: false,
  initialNote: ""
};

export default UploadFile;
