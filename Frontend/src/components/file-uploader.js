import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import BackupSharpIcon from '@material-ui/icons/BackupSharp';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import styled from 'styled-components';

const UploadText = styled.span`
  margin-left: 5px;
`;

const FileWrapper = styled.div`
  margin-bottom: 20px;
`

// const FileInfo = styled.div`

// `
function FileUploadSingle(props) {
  //file:  name, json
  const [file, setFile] = useState();


  const handleFileChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0]
      console.log(e.target.files[0])
      setFile(e.target.files[0]);

      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = function () {
        const json = JSON.parse(reader.result)
        console.log('json------------------', json)
        // thisBak.importJson = json
        props.changeFile({name: file.name, json})
      }
    }
  };

  const clearFile = () => {
    props.changeFile({name: '', json: []})
  }

  return (
    <FileWrapper>
       <Button variant="contained" component="label" >
            {" "}
            <BackupSharpIcon /> 
            <UploadText >Upload a file</UploadText>
            <input type="file" hidden onChange={handleFileChange} accept=".json"/>
        </Button>
        {props.file && (
          <div>
            {props.file.name}
            <DeleteOutlineIcon onClick={clearFile} style={{verticalAlign:"middle", cursor: "pointer"}}/>
          </div>
        )}
    </FileWrapper>
  );
}

export default FileUploadSingle;