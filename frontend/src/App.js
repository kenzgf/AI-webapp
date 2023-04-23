import { useState } from "react";
import "./styles.css";
import { Button, Grommet } from "grommet";
import UploadFile from "./UploadFile";
export default function App() {
  const [upload, showUpload] = useState(false);
  return (
    <div className="App">
      <Grommet full>
        <Button style={{marginTop: 25}}label="click to start" onClick={() => showUpload(true)} primary />
        <div style={{width: '42%', position: 'relative', left: '28.5%'}}>
          <h4>Hi! This is Gefei Zhu and this is my fun little webapp that allows the user to upload an image of a person and get a prediction of which of the seven emotions the person exhibits. The seven emotions are: Anger, Disgust, Fear, Happy, Neutral, Sadness, and Surprise, represented by the seven emojis: 👿, 🤢, 😱, 😊, 😐, 😔, 😲.</h4>
          <h4>This app is implemented using tensorflow's CNN architecture DenseNet169 as the input layer, combined with 3 layers of size 256, 1024, and 512, activated by the ReLU function and dropout between layers of 30%, 50%, and 50%. The loss function used is categorical cross-entropy.</h4>
          <h4>The training data I used is the FER2013 dataset, consisting of 35,685 examples of 48x48 pixel gray scale images displaying the 7 emotions. When you are ready, click the purple button above and upload an image of your choice.</h4>
          <h1>Have fun!</h1>
        </div>
        {upload && (
          <UploadFile
            setLayer={showUpload}
            accept=".jpg,.png,.jpeg"
            title="Upload Documents"
            multiple
            imageCropAspect={1}
            fixedAspect={true}
          />
        )}
      </Grommet>
    </div>
  );
}
