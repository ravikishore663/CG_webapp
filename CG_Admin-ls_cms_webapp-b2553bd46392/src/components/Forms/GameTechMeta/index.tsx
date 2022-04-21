import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  FormGroup,
  FormControl,
  FormLabel,
  Tooltip,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider
} from '@mui/material';
import { Help } from '@mui/icons-material';
import { gameStepperStore } from '../../../zstore';

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

const loadTimes = [{
  value: 1,
  label: '1s'
}, {
  value: 2,
  label: '2s'
}, {
  value: 3,
  label: '3s'
}, {
  value: 4,
  label: '4s'
}, {
  value: 5,
  label: '5s'
}, {
  value: 6,
  label: '6s'
}, {
  value: 7,
  label: '7s'
}, {
  value: 8,
  label: '8s'
}, {
  value: 9,
  label: '9s'
}, {
  value: 10,
  label: '10s'
}, {
  value: 10,
  label: '10+ s'
}];

const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-valueLabel.MuiSlider-valueLabelOpen': {
    transform: 'translateY(100%)',
    marginTop: '13px',
    '&::before': {
      top: '-8px',
    }
  }
}));

const GameTechMeta = () => {
  const [selectedMinVersion, setSelectedMinVersion] = React.useState<string>(gameStepperStore(state => state.gamePayload.minVersion));
  const [selectedLoadTime, setSelectedLoadTime] = React.useState<string>(gameStepperStore(state => state.gamePayload.loadTime));
  const setPayload = gameStepperStore(state => state.setPayload);
  const setStepValidation = gameStepperStore(state => state.setValidation);
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    minVersion: {
      valid: (selectedMinVersion) ? true : false
    },
    loadTime: {
      valid: (selectedLoadTime) ? true : false
    }
  });

  const handleMinVersionChange = (event: SelectChangeEvent) => {
    setSelectedMinVersion(event.target.value);
    setPayload('minVersion', event.target.value);
    setValidation({...validation, minVersion: { valid: true }});
  };

  const handleLoadTimeChange = (event: SelectChangeEvent) => {
    setSelectedLoadTime(event.target.value);
    setPayload('loadTime', event.target.value);
    setValidation({...validation, loadTime: { valid: true }});
  };

  useEffect(() => {
    const handleValidation = () => {
      const keys = Object.keys(validation);
      let valids: number = 0;
      keys.forEach((key: string) => {
        if (validation[key].valid) valids++;
      })
      setStepValidation('tech', (valids === keys.length));
    }
    handleValidation();
  }, [validation]);

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
                <MenuItem value={version.value} key={version.label}>{version.label}</MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
      <FormControl sx={{pt: 4}}>
        <FormLabel sx={{ pb: 2, display: 'flex' }}>
          Load Time *
          <div style={{paddingTop: '1px'}}>
            <Tooltip title="The time for game to be interactive" arrow>
              <Help sx={{ml: 1}} fontSize="small" />
            </Tooltip>
          </div>
        </FormLabel>
        <Select
          displayEmpty
          value={selectedLoadTime}
          onChange={handleLoadTimeChange}
        >
          <MenuItem sx={{display: 'none'}} value="" disabled>
            <span style={{color: '#aaa'}}>Select Load Time</span>
          </MenuItem>
          {
            loadTimes.map((loadTime: any) => {
              return (
                <MenuItem value={loadTime.value} key={loadTime.label}>{loadTime.label}</MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    </FormGroup>
  );
}

export default GameTechMeta;
