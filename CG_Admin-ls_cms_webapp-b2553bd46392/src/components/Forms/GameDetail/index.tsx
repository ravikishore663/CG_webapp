import React, { ChangeEvent, useEffect } from 'react';
import {
  FormGroup,
  FormControl,
  Box,
  FormLabel,
  Tooltip,
  TextField,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormHelperText,
  Chip,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Help } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { gameStepperStore } from '../../../zstore';

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

const portraitValues = [{
  label: 'Landscape',
  value: false,
}, {
  label: 'Portrait',
  value: true
}];

const checkValidString = (value: string): boolean => {
  const regexWithoutSpecialChar = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regexWithoutSpecialChar.test(value)) {
      return true
    }

    return false
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

const GameDetailForm = () => {
  const [title, setTitle] = React.useState<string>(gameStepperStore(state => state.gamePayload.gameTitle));
  const [domain, setDomain] = React.useState<string>(gameStepperStore(state => state.gamePayload.domain));
  const [subDomain, setSubDomain] = React.useState<string>(gameStepperStore(state => state.gamePayload.subDomain));
  const [ages, setAges] = React.useState<number[]>(gameStepperStore(state => state.gamePayload.ages));
  const [isPortrait, setIsPortrait] = React.useState<boolean>(gameStepperStore(state => state.gamePayload.isPortrait));
  const setPayload = gameStepperStore(state => state.setPayload);
  const setStepValidation = gameStepperStore(state => state.setValidation);
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    title: {
      valid: checkValidString(title)
    },
    domain: {
      valid: (domain) ? true : false
    },
    maxMinAge: {
      valid: (ages[0] !== ages[1]) ? true : false
    },
    isPortrait: {
      valid: (isPortrait === true || isPortrait === false)
    }
  });

  useEffect(() => {
    const handleValidation = () => {
      const keys = Object.keys(validation);
      let valids: number = 0;
      keys.map((key: string) => {
        if (validation[key].valid) valids++
      })
      setStepValidation('gameDetail', (valids === keys.length));
    }
    handleValidation()
  }, [validation]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== " " && event.target.value.split("")[0] !== " ") {
      const value = event.target.value.trim();
      setTitle(event.target.value);
      setPayload('gameTitle', `${value}`);
      setValidation({...validation, title: {valid: checkValidString(event.target.value)}});
    }
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

  const valuetext = (value: number) => {
    return `${value} years`;
  }
  
  const handleAgeChange = (event: Event, value: number | number[], thumb: number) => {
    setPayload('ages', value);
    setAges(value as number[]);
  }

  const handleIsPortraitChange = (event: ChangeEvent, value: string) => {
    setIsPortrait(value === 'true' ? true : false);
    setPayload('isPortrait', value === 'true' ? true : false);
  }

  return (
    <FormGroup>
      <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Game Name *</FormLabel>
          <Tooltip title="This will appear to the user" arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <TextField error={(title !== '' && !validation.title.valid)} helperText={(title !== '' && !validation.title.valid) ? "Invalid game name" : ""} value={title} placeholder='Enter name of game' onChange={handleTitleChange}></TextField>
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
              <MenuItem value={domain.label} key={domain.label}>{domain.label}</MenuItem>
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
        <FormLabel sx={{ pb: 2 }}>Game orientation *</FormLabel>
      </Box>
      <RadioGroup
        aria-labelledby="is_portrait"
        value={isPortrait}
        name="isPortrait"
        row
        onChange={handleIsPortraitChange}
      >
        {
          portraitValues.map((option: any) => (
            <FormControlLabel
              key={option.label}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))
        }
      </RadioGroup>
     </FormControl>
    </FormGroup>
  );
};

export default GameDetailForm
