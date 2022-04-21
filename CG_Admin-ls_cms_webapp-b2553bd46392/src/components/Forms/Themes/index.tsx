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
  Chip
} from '@mui/material';
import { Help } from '@mui/icons-material';
import {request, requestAdmin} from '../../../utils/request';
import { videoStepperStore } from '../../../zstore';

const fetchThemes = async (filter = {}) => {
  const url = '/admin/themes';
  try {
    return await requestAdmin({
      url,
      method: 'GET'
    });
  } catch (err) {
    console.error(err) 
  }
}

const fetchSubThemes = async (filter = {}) => {
  const url = '/admin/sub-themes';
  try {
    return await requestAdmin({
      url,
      method: 'GET'
    });
  } catch (err) {
    console.error(err) 
  }
}

const fetchLastOrder = async (subThemeId: number) => {
  const url = `/admin/sub-themes/${subThemeId}/videos/last-order`;
  try {
    return await requestAdmin({
      url,
      method: 'GET'
    });
  } catch (err) {
    console.error(err) 
  }
}

const ThemeForm = () => {
  const [themes, setThemes] = React.useState<any>([]);
  const [subThemes, setSubThemes] = React.useState<any>([]);
  const [filteredSubThemes, setFilteredSubThemes] = React.useState(subThemes);
  const [selectedTheme, setSelectedTheme] = React.useState<number>(videoStepperStore(state => state.videoPayload.themeId));
  const [selectedSubTheme, setSelectedSubTheme] = React.useState<number>(videoStepperStore(state => state.videoPayload.subThemeId));
  const [lastOrderVideo, setLastOrderVideo] = React.useState<number>(videoStepperStore(state => state.videoPayload.videoOrder));
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    theme: {
      valid: (selectedTheme) ? true : false
    },
    subTheme: {
      valid: (selectedSubTheme) ? true : false
    }
  })
  const setPayload = videoStepperStore(state => state.setPayload);
  const setStepValidation = videoStepperStore(state => state.setValidation);
  const formValidation = React.useState(videoStepperStore(state => state.formValidation));


  useEffect(() => {
    const getThemeList = async () => {
      const data = await fetchThemes();
      setThemes(data);
    }

    const getSubThemeList = async () => {
      const data = await fetchSubThemes();
      
      if (selectedTheme) {
        const filtered = data.filter((theme: any) => theme.parentId === selectedTheme)
        setFilteredSubThemes(filtered)
      }
      
      setSubThemes(data);
    }

    getThemeList();
    getSubThemeList();
  }, []);

  useEffect(() => {
    const handleValidation = () => {
      const keys = Object.keys(validation);
      let valids: number = 0;
      keys.map((key: string) => {
        if (validation[key].valid) valids++
      })
      setStepValidation('theme', (valids === keys.length));
    }
    handleValidation()
  }, [validation])

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(Number(event.target.value))
    const findTheme = themes.filter((theme: any) => theme.id === Number(event.target.value))[0]
    const filteredSubThemes = subThemes.filter((theme: any) => theme.parentId === findTheme.id);
    setLastOrderVideo(0);
    setFilteredSubThemes(filteredSubThemes);
    setPayload('themeId', Number(event.target.value));
    setPayload('themeName', findTheme.name);
    setValidation({...validation, theme: {valid: true}})
  }

  const handleSubThemeChange = async (event: SelectChangeEvent) => {
    setSelectedSubTheme(Number(event.target.value))
    setPayload('subThemeId', Number(event.target.value));
    const findTheme = subThemes.filter((theme: any) => theme.id === Number(event.target.value))[0]
    setPayload('subThemeName', findTheme.name);
    const { lastOrder } = await fetchLastOrder(Number(event.target.value));
    setPayload('videoOrder', lastOrder + 1);
    setLastOrderVideo(lastOrder + 1);
    setValidation({...validation, subTheme: {valid: true}})
  }

  return (
    <FormGroup>
      <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Theme *</FormLabel>
          <Tooltip title="This is the main theme/podium under which the video will be visible" arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <Select
          displayEmpty
          value={`${selectedTheme}`}
          onChange={handleThemeChange}
        >
          <MenuItem sx={{display: 'none'}} value={0} disabled>
            <span style={{color: '#aaa'}}>Select Available Theme</span>
          </MenuItem>
          {
            themes.map((theme: any) => {
              return (
                <MenuItem value={theme.id}>{theme.name}</MenuItem>
              )
            })
          }
        </Select>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Sub Theme *</FormLabel>
          <Tooltip title="This is the main sub-theme/podium under which the video will be visible" arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <Select
          displayEmpty
          value={`${selectedSubTheme}`}
          onChange={handleSubThemeChange}
          disabled={`${selectedTheme}` === "0"}
        >
          <MenuItem sx={{display: 'none'}} value={0} disabled>
            <span style={{color: '#aaa'}}>Select Available Sub Theme</span>
          </MenuItem>
          {
            filteredSubThemes.map((theme: any) => {
              return (
                <MenuItem value={theme.id}>{theme.name}</MenuItem>
              )
            })
          }
        </Select>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>
            Video Order
          </FormLabel>
          <Tooltip title="This is the default order provided to the Video, this can be changed from Theme section after publishing. Note ! The video order will always be considered after the game order" arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <Chip sx={{width: 100}} label={lastOrderVideo} color="primary" />
     </FormControl>
    </FormGroup>
  )
}

export default ThemeForm;