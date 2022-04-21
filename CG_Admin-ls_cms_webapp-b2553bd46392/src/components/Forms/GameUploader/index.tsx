import React, { useEffect } from 'react';
import {
  FormGroup,
  FormControl,
  FormLabel,
  Tooltip,
  FormHelperText
} from '@mui/material';
import { AttachFile, Theaters, Help } from '@mui/icons-material';
import { DropzoneArea } from 'react-mui-dropzone';

import { gameStepperStore } from '../../../zstore';

const GameUploader = () => {
  const [uploadedGame, setUploadedGame] = React.useState<File[]>([gameStepperStore(state => state.gamePayload.gameFile)] as File[]);
  const [uploadedIconFile, setUploadedIcon] = React.useState<File[]>([gameStepperStore(state => state.gamePayload.iconFile)] as File[]);
  const setPayload = gameStepperStore(state => state.setPayload);
  const setStepValidation = gameStepperStore(state => state.setValidation);
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    video: {
      valid: (uploadedGame.length > 0 && uploadedGame[0]) ? true : false
    },
    thumbnail: {
      valid: (uploadedIconFile.length > 0 && uploadedIconFile[0]) ? true : false
    }
  });

  useEffect(() => {
    const handleValidation = () => {
      const keys = Object.keys(validation);
      let valids: number = 0;
      keys.map((key: string) => {
        if (validation[key].valid) valids++
      })
      setStepValidation('meta', (valids === keys.length));
    }
    handleValidation()
  }, [validation]);

  const handlePreviewIcon = (fileObject: any, classes: any) => {
    const { type } = fileObject.file;
    const iconProps = {
      className : classes.image,
    }
  
    if (type.startsWith("game/")) return <Theaters {...iconProps} />;
  
    return <AttachFile {...iconProps} />;
  }

  const handleGameFileUpload = async (files: File[]) => {
    setUploadedGame(files);
    if (files.length > 0) {
      const file = files[0];
      setPayload('gameFile', file);
      setValidation({ ...validation, video: { valid: true }});
    } else {
      setValidation({ ...validation, video: { valid: false }});
    }
  };

  const handleThumbnailUpload = async (files: File[]) => {
    setUploadedIcon(files);
    if (files.length > 0) {
      const file = files[0];
      setPayload('iconFile', file);
      setValidation({...validation, thumbnail: {valid: true}})
    } else {
      setValidation({...validation, thumbnail: {valid: false}})
    }
  };

  return (
    <FormGroup>
      <FormControl sx={{mt: 4}}>
        <FormLabel sx={{ pb: 2, display: 'flex' }}>
          Upload Game in zip *
          <div style={{paddingTop: '1px'}}>
            <Tooltip title="The video upload, encoding and link share will happen in background. Note! Video link will be accessible after at least 10-20 mins of upload depending on the size of the video" arrow>
              <Help sx={{ml: 1}} fontSize="small" />
            </Tooltip>
          </div>
        </FormLabel>
        <div style={{color: "rgba(98, 98, 98, 0.5)", width: 250}}>
          <DropzoneArea 
            dropzoneClass={(uploadedGame.length > 0 && uploadedGame[0]) ? 'hideDropzoneContainer' : '' }
            previewGridClasses={{container: 'customGridPreview', item: 'customGridItemPreview', image: 'customGridImagePreview'}} 
            acceptedFiles={['.zip']}
            maxFileSize={520000000} 
            getPreviewIcon={handlePreviewIcon} 
            onChange={handleGameFileUpload}
            filesLimit={1}
            showFileNames={true}
            initialFiles={uploadedGame}
          />
        </div>
        <FormHelperText sx={{ml: 0}} id="component-helper-text">
          Max game file size allowed is 500mb
        </FormHelperText>
      </FormControl>
      <FormControl sx={{mt: 5}}>
        <FormLabel sx={{ pb: 2 }}>Upload Game Icon *</FormLabel>
        <div style={{color: "rgba(98, 98, 98, 0.5)", width: 250}}>
          <DropzoneArea 
            dropzoneClass={(uploadedIconFile.length > 0 && uploadedIconFile[0]) ? 'hideDropzoneContainer' : '' }
            previewGridClasses={{container: 'customGridPreview', item: 'customGridItemPreview', image: 'customGridImagePreview'}} 
            maxFileSize={520000}
            acceptedFiles={['image/*']}
            onChange={handleThumbnailUpload}
            filesLimit={1}
            initialFiles={uploadedIconFile}
          />
        </div>
        <FormHelperText sx={{ml: 0}} id="component-helper-text">
          Max icon file size allowed is 500kb
        </FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

export default GameUploader;
