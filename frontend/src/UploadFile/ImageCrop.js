import { memo, useRef } from "react";
import _ from "lodash";
import { Box, Text } from "grommet";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { CropContainer, UploadingBox } from "./utils";

const ImageCrop = memo(
  ({ image, aspect, setFieldValue, isSubmitting, fixedAspect }) => {
    const ref = useRef();
    // console.log('rerendering...');

    const onCrop = () => {
      const imageElement = ref?.current;
      const cropper = imageElement?.cropper;
      const { cropBoxData, canvasData } = cropper;
      const imageRef = cropper.canvas.children[0];
      let cropData = {
        x: cropBoxData.left - canvasData.left,
        y: cropBoxData.top - canvasData.top,
        height: cropBoxData.height,
        width: cropBoxData.width,
        imageWidth: imageRef.width,
        imageHeight: imageRef.height,
        imageNaturalWidth: imageRef.naturalWidth,
        imageNaturalHeight: imageRef.naturalHeight
      };

      setFieldValue("imageRef", imageRef);
      setFieldValue("croppedAreaPixels", cropData);
    };

    const debouncedOnCrop = _.debounce(onCrop, 500);

    return (
      <>
        <Text size="14px" margin={{ bottom: "small" }}>
          Crop Image
        </Text>
        <Box direction="column" justify="center" align="center">
          <CropContainer disabled={isSubmitting}>
            {isSubmitting && (
              <UploadingBox align="center" justify="center">
                <Text color="white" size="large">
                  Please Wait...
                </Text>
              </UploadingBox>
            )}
            <Cropper
              style={{ height: "100%" }}
              src={URL.createObjectURL(image)}
              initialAspectRatio={aspect}
              aspectRatio={fixedAspect ? aspect : NaN}
              viewMode={1}
              guides={true}
              minCropBoxHeight={40}
              minCropBoxWidth={40}
              background={false}
              responsive={true}
              movable={false}
              scalable={false}
              zoomable={false}
              zoomOnWheel={false}
              autoCropArea={1}
              crop={debouncedOnCrop}
              checkOrientation={false} 
              ref={ref}
            />
          </CropContainer>
        </Box>
      </>
    );
  }
);

ImageCrop.displayName = "ImageCrop";

export default ImageCrop;
