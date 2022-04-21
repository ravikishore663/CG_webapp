import React, { useEffect } from 'react';
import {
  FormGroup,
  FormControl,
  TextField,
  Slider,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
  Button,
  IconButton,
  Icon,
  Box,
  Chip,
  FormHelperText
} from '@mui/material';
import { Help } from '@mui/icons-material';
import {request, requestAdmin} from '../../../utils/request';
import { videoStepperStore } from '../../../zstore';
import { styled } from '@mui/material/styles';


const minVersions = [
  {
    label: '3.3.0',
    value: '3.3.0'
  },
  {
    label: '3.2.0',
    value: '3.2.0'
  },
  {
    label: '3.1.1',
    value: '3.1.1'
  },
  {
    label: '3.1.0',
    value: '3.1.0'
  },
  {
    label: '2.8.2',
    value: '2.8.2'
  },
  {
    label: '2.7.0',
    value: '2.7.0'
  },
  {
    label: '2.6.1',
    value: '2.6.1'
  },
  {
    label: '2.6.0',
    value: '2.6.0'
  },
  {
    label: '2.5.1',
    value: '2.5.1'
  },
  {
    label: '2.5.0',
    value: '2.5.0'
  },
  {
    label: '2.4.1',
    value: '2.4.1',
  },
  {
    label: '1.9.0',
    value: '1.9.0',
  },
];

const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-valueLabel.MuiSlider-valueLabelOpen': {
    transform: 'translateY(100%)',
    marginTop: '13px',
    '&::before': {
      top: '-8px',
    }
  }
}));

const TechMeta = () => {
  const [selectedMinVersion, setSelectedMinVersion] = React.useState<string>(videoStepperStore(state => state.videoPayload.minVersion));
  const [videoLength, setVideoLength] = React.useState<number | undefined>(videoStepperStore(state => state.videoPayload.videoLength));
  // const [start, setStart] = React.useState(0);
  // const [end, setEnd] = React.useState(0);
  const [max, setMax] = React.useState<number>(videoLength || 0);
  const [startEnd, setStartEnd] = React.useState<number[]>([0, videoLength || 0])
  const setPayload = videoStepperStore(state => state.setPayload);
  const setStepValidation = videoStepperStore(state => state.setValidation);
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    minVersion: {
      valid: (selectedMinVersion) ? true : false
    },
    startEndTime: {
      valid: (startEnd[0] !== startEnd[1]) ? true : false
    }
  });

  useEffect(() => {
    const handleValidation = () => {
      console.log(validation);
      const keys = Object.keys(validation);
      let valids: number = 0;
      keys.map((key: string) => {
        if (validation[key].valid) valids++
      })
      setStepValidation('tech', (valids === keys.length));
    }
    handleValidation()
  }, [validation])
  // const []
  
  const handleMinVersionChange = (event: SelectChangeEvent) => {
    setSelectedMinVersion(event.target.value);
    setPayload('minVersion', event.target.value);
    setValidation({...validation, minVersion: {valid: true}})
  }

  const handleVideoLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > 0) {
      setVideoLength(Number(event.target.value));
      setMax(Number(event.target.value));
      setStartEnd([0, Number(event.target.value)]);
      setValidation({
        ...validation, 
        startEndTime: {
          valid: true
        }
      })
      setPayload('videoLength', Number(event.target.value));
    } else {
      setVideoLength(undefined);
      setMax(0);
      setStartEnd([0, 0]);
      setValidation({
        ...validation, 
        startEndTime: {
          valid: false
        }
      })
      setPayload('videoLength', 0);
    }
    // setPayload('videoTitle', `${event.target.value}`);
  }

  const handleStartEndChange = (event: Event, value: number | number[], thumb: number) => {
    const input = value as number[];
    // setEnd(input[1])
    // setStart(input[0])
    setStartEnd(input);
    setPayload('startEnd', input);
    setValidation({
      ...validation, 
      startEndTime: {
        valid: (input[0] !== input[1])
      }
    })
  }

  return (
    <FormGroup>
      <FormControl sx={{pt: 4}}>
        <FormLabel sx={{ pb: 2, display: 'flex' }}>
          Minimum Version *
          <div style={{paddingTop: '1px'}}>
            <Tooltip title="The min version of android app, from which this video will visible" arrow>
              <Help sx={{ml: 1}} fontSize="small" />
            </Tooltip>
          </div>
        </FormLabel>
        <Select
          displayEmpty
          value={selectedMinVersion}
          onChange={handleMinVersionChange}
        >
          <MenuItem sx={{display: 'none'}} value="" disabled>
            <span style={{color: '#aaa'}}>Select Minimum Version</span>
          </MenuItem>
          {
            minVersions.map((version: any) => {
              return (
                <MenuItem value={version.value}>{version.label}</MenuItem>
              )
            })
          }
        </Select>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <FormLabel sx={{ pb: 2, display: 'flex' }}>
          Length Of Video *
          <div style={{paddingTop: '1px'}}>
            <Tooltip title="Total length of the video in seconds" arrow>
              <Help sx={{ml: 1}} fontSize="small" />
            </Tooltip>
          </div>
        </FormLabel>
        <TextField value={(videoLength && videoLength >= 0) ? videoLength : ''} placeholder='Input the total length of the video...' type={'number'} onChange={handleVideoLengthChange}></TextField>
     </FormControl>
     <FormControl sx={{pt: 4}}>
      <Box display="flex">
        <div style={{paddingBottom: 10}}>
          <FormLabel sx={{display: 'flex' }}>
            Start and End Time (Seconds) *
            <div style={{paddingTop: '1px'}}>
              <Tooltip title="This is the start and end time of the video for which it will play" arrow>
                <Help sx={{ml: 1}} fontSize="small" />
              </Tooltip>
            </div>
          </FormLabel>
          {
            ((startEnd[0] === startEnd[1]) && (videoLength && videoLength > 0)) ? <FormHelperText sx={{ml: 0, color: '#d32f2f'}}>Start and End Time cannot be the same</FormHelperText> : <></>
          }
        </div>
        <Box sx={{ flex: '1 1 auto' }} />
        <FormLabel sx={{pb: 2}}>
          <Chip sx={{width: 130, mb: 2}} label={`${startEnd[0]} - ${startEnd[1]} Seconds`} color={((startEnd[0] === startEnd[1]) && (videoLength && videoLength > 0)) ? "error" : "primary"} />
        </FormLabel>
      </Box>
      <Box sx={{display: 'flex'}}>
        <FormLabel sx={{width: 35}}>0 S</FormLabel>
        <CustomSlider
            value={startEnd}
            valueLabelDisplay="on"
            step={5}
            marks
            min={0}
            max={max}
            sx={{ml: 2, mr: 2}}
            onChange={handleStartEndChange}
          />
        <FormLabel sx={{width: 70}}>{max} S</FormLabel>
      </Box>
     </FormControl>
    </FormGroup>
  )
}

export default TechMeta;