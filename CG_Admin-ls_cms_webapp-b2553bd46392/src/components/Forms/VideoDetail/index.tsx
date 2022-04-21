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
  Box,
  Tooltip,
  Chip,
  FormHelperText
} from '@mui/material';
import { Help } from '@mui/icons-material';
import {request, requestAdmin} from '../../../utils/request';
import { styled } from '@mui/material/styles';

import { videoStepperStore } from '../../../zstore';

const domains = [{
  label: 'Aesthetic & Creative Expression',
  value: 'Aesthetic & Creative Expression',
}, {
  label: 'Numeracy',
  value: 'Numeracy',
}, {
  label: 'Literacy & Language',
  value: 'Literacy & Language'
}, {
  label: 'Discovery of the world',
  value: 'Discovery of the world'
}, {
  label: 'Motor Skills',
  value: 'Motor Skills'
}, {
  label: 'Social & Emotional Learning',
  value: 'Social & Emotional Learning'
}];

const fetchVendors = async (filter = {}) => {
  const url = '/admin/vendors';
  try {
    return await requestAdmin({
      url,
      method: 'GET'
    });
  } catch (err) {
    console.error(err) 
  }
}

const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-valueLabel.MuiSlider-valueLabelOpen': {
    transform: 'translateY(100%)',
    marginTop: '13px',
    '&::before': {
      top: '-8px',
    }
  }
}));

const checkValidString = (value: string): boolean => {
  const regexWithoutSpecialChar = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regexWithoutSpecialChar.test(value)) {
      return true
    }

    return false
}

const VideoDetailForm = () => {
  const [title, setTitle] = React.useState<string>(videoStepperStore(state => state.videoPayload.videoTitle));
  const [domain, setDomain] = React.useState<string>(videoStepperStore(state => state.videoPayload.domain));
  const [subDomain, setSubDomain] = React.useState<string>(videoStepperStore(state => state.videoPayload.subDomain));
  const [ages, setAges] = React.useState<number[]>(videoStepperStore(state => state.videoPayload.ages));
  const [vendors, setVendors] = React.useState<any>([]);
  const [vendor, setVendor] = React.useState<number>(videoStepperStore(state => state.videoPayload.vendorId));
  const setPayload = videoStepperStore(state => state.setPayload);
  const setStepValidation = videoStepperStore(state => state.setValidation);
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    title: {
      valid: checkValidString(title)
    },
    domain: {
      valid: (domain) ? true : false
    },
    vendor: {
      valid: (vendor) ? true : false
    },
    maxMinAge: {
      valid: (ages[0] !== ages[1]) ? true : false
    }
  })
  const formValidation = React.useState(videoStepperStore(state => state.formValidation));

  useEffect(() => {
    const getVendorList = async () => {
      const data = await fetchVendors();
      setVendors(data);
    }

    getVendorList();
  }, []);

  useEffect(() => {
    const handleValidation = () => {
      const keys = Object.keys(validation);
      let valids: number = 0;
      keys.map((key: string) => {
        if (validation[key].valid) valids++
      })
      setStepValidation('videoDetail', (valids === keys.length));
    }
    handleValidation()
  }, [validation])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== " " && event.target.value.split("")[0] !== " ") {
      const value = event.target.value.trim();
      setTitle(event.target.value);
      setPayload('videoTitle', `${value}`);
      setValidation({...validation, title: {valid: checkValidString(event.target.value)}});
    }
  }

  const valuetext = (value: number) => {
    return `${value}°C`;
  }
  
  const handleAgeChange = (event: Event, value: number | number[], thumb: number) => {
    setPayload('ages', value);
    setAges(value as number[]);
  }

  const handleDomainChange = (event: SelectChangeEvent) => {
    setDomain(event.target.value);
    setPayload('domain', event.target.value);
    setValidation({...validation, domain: {valid: true}});
  };

  const handleSubDomainChange = (event: SelectChangeEvent) => {
    setSubDomain(event.target.value);
    setPayload('subDomain', event.target.value);
  };

  const handleVendor = (event: SelectChangeEvent) => {
    setVendor(parseInt(event.target.value));
    setPayload('vendorId', event.target.value);
    setValidation({...validation, vendor: {valid: true}});
  }

  return (
   <FormGroup>
     <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Video Name *</FormLabel>
          <Tooltip title="This will appear to the user" arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <TextField error={(title !== '' && !validation.title.valid)} helperText={(title !== '' && !validation.title.valid) ? "Invalid video name" : ""} value={title} placeholder='Enter name of video' onChange={handleTitleChange}></TextField>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <FormLabel sx={{ pb: 2 }}>Learning Domain *</FormLabel>
        <Select
          displayEmpty
          value={domain}
          onChange={handleDomainChange}
        >
          <MenuItem sx={{display: 'none'}} value="" disabled>
            <span style={{color: '#aaa'}}>Select Learning Domain</span>
          </MenuItem>
          {domains.map((domain, index) => {
            return (
              <MenuItem value={domain.label}>{domain.label}</MenuItem>
            )
          })}
        </Select>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <FormLabel sx={{ pb: 2 }}>Learning SubDomain <small>(optional)</small></FormLabel>
        <Select
          displayEmpty
          value={subDomain}
          disabled={(domain === '')}
          onChange={handleSubDomainChange}
        >
          <MenuItem sx={{display: 'none'}} value="" disabled>
            <span style={{color: '#aaa'}}>Select Learning SubDomain</span>
          </MenuItem>
        </Select>
     </FormControl>
     <FormControl sx={{pt: 4}}>
      <Box display="flex">
        <div>
          <FormLabel sx={{ pb: 2 }}>Select Age Range *</FormLabel>
          <Tooltip title="Users having age outside the given age range will not be able to see this video." arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
          {
            (ages[0] === ages[1]) ? <FormHelperText color="error" sx={{ml: 0, color: '#d32f2f'}}>Ages cannot be the same</FormHelperText> : <></>
          }
        </div>
        <Box sx={{ flex: '1 1 auto' }} />
        <FormLabel sx={{pb: 2}}>
          <Chip sx={{width: 130, mb: 2}} label={`${ages[0]} - ${ages[1]} Years`} color={(ages[0] === ages[1]) ? "error": "primary"} />
        </FormLabel>
      </Box>
      <Box sx={{display: 'flex',}}>
        <FormLabel sx={{width: 100}}>3 Years</FormLabel>
        <CustomSlider
            aria-label="Temperature"
            value={ages}
            getAriaValueText={valuetext}
            valueLabelDisplay="on"
            step={1}
            marks
            min={3}
            max={17}
            sx={{ml: 2, mr: 2}}
            onChange={handleAgeChange}
          />
        <FormLabel sx={{width: 100}}>17 Years</FormLabel>
      </Box>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Video Partner *</FormLabel>
          <Tooltip title="Name of the partner providing the video" arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <Select
          displayEmpty
          value={`${vendor}`}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            }
          }}
          onChange={handleVendor}
        >
          <MenuItem sx={{display: 'none'}} value={'0'} disabled>
            <span style={{color: '#aaa'}}>Select Video Partner</span>
          </MenuItem>
          {
            vendors.map((vendor: any) => (
              <MenuItem value={vendor.id}>{vendor.name}</MenuItem>
            ))
          }
        </Select>
     </FormControl>
   </FormGroup> 
  )
}

export default VideoDetailForm;