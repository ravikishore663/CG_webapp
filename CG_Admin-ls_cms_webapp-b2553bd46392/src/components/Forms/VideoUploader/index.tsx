import React, { useEffect } from 'react';
import { DropzoneArea } from 'react-mui-dropzone';
import {
    FormGroup,
    FormControl,
    FormLabel,
    FormHelperText,
    Tooltip
  } from '@mui/material';
import {request, requestAdmin, commonRequest} from '../../../utils/request';
import { AttachFile, Theaters, Help } from '@mui/icons-material';
import { videoStepperStore } from '../../../zstore';


const VideoUploader = () => {
  const [uploadedVideo, setUploadedVideo] = React.useState<File[]>([videoStepperStore(state => state.videoPayload.videoFile)] as File[])
  const [uploadedIconFile, setUploadedIcon] = React.useState<File[]>([videoStepperStore(state => state.videoPayload.iconFile)] as File[])
  const setPayload = videoStepperStore(state => state.setPayload);
  const setStepValidation = videoStepperStore(state => state.setValidation);
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    video: {
      valid: (uploadedVideo.length > 0 && uploadedVideo[0]) ? true : false
    },
    thumbnail: {
      valid: (uploadedIconFile.length > 0 && uploadedIconFile[0]) ? true : false
    }
  });

  const handleVideoUpload = async (files: File[]) => {
    setUploadedVideo(files);
    if (files.length > 0) {
      const file = files[0];
      // const data = new FormData();
      // data.append('bucketName', 'arigibucket');
      // data.append('fileName', file.name);
      // data.append('fileType', file.type);
      // data.append('video', file);
      setPayload('videoFile', file);
      setValidation({...validation, video: {valid: true}})
      // console.log
      // const {url} = await requestAdmin({
      //   url: '/admin/file-uploader/aws/generate-signed-url',
      //   method: 'POST',
      //   headers: { "Content-Type": "multipart/form-data" },
      //   data
      // });
      // console.log(url)
    } else {
      setValidation({...validation, video: {valid: false}})
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
  }

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
  }, [validation])


  const handlePreviewIcon = (fileObject: any, classes: any) => {
    const {type} = fileObject.file
    const iconProps = {
      className : classes.image,
    }
  
    if (type.startsWith("video/")) return <Theaters {...iconProps} />
  
    return <AttachFile {...iconProps} />
  }

  return (
    <FormGroup>
      <FormControl sx={{mt: 4}}>
        <FormLabel sx={{ pb: 2, display: 'flex' }}>
          Upload Video in MP4/MPeG *
          <div style={{paddingTop: '1px'}}>
            <Tooltip title="The video upload, encoding and link share will happen in background. Note! Video link will be accessible after at least 10-20 mins of upload depending on the size of the video" arrow>
              <Help sx={{ml: 1}} fontSize="small" />
            </Tooltip>
          </div>
        </FormLabel>
        <div style={{color: "rgba(98, 98, 98, 0.5)", width: 250}}>
          <DropzoneArea 
            dropzoneClass={(uploadedVideo.length > 0 && uploadedVideo[0]) ? 'hideDropzoneContainer' : '' }
            previewGridClasses={{container: 'customGridPreview', item: 'customGridItemPreview', image: 'customGridImagePreview'}} 
            acceptedFiles={['video/mp4', 'video/mpeg']}
            maxFileSize={520000000} 
            getPreviewIcon={handlePreviewIcon} 
            onChange={handleVideoUpload} filesLimit={1}
            showFileNames={true}
            initialFiles={uploadedVideo}
          />
        </div>
        <FormHelperText sx={{ml: 0}} id="component-helper-text">
          Max Video file size allowed is 500mb
        </FormHelperText>
      </FormControl>
      <FormControl sx={{mt: 5}}>
        <FormLabel sx={{ pb: 2 }}>Upload Video Thumbnail *</FormLabel>
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
          Max Thumbnail file size allowed is 500kb
        </FormHelperText>
      </FormControl>
    </FormGroup>
  )
}
export default VideoUploader;