import { useState } from "react";
import "./styles.css";
import { Button, Grommet } from "grommet";
import UploadFile from "./UploadFile";
export default function App() {
  const [upload, showUpload] = useState(false);
  return (
    <div className="App">
      <Grommet full>
        <Button label="click to start" onClick={() => showUpload(true)} primary />
        {upload && (
          <UploadFile
            setLayer={showUpload}
            accept=".pdf,.jpg,.png,.jpeg,.xls,.xlsx,.doc,.docx.insv"
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
