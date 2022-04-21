import React, { useEffect } from 'react';
import {
  FormGroup,
  Box,
  FormLabel,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip
} from '@mui/material';
import { Help } from '@mui/icons-material';
import { requestAdmin } from '../../../utils/request';

import { gameStepperStore } from '../../../zstore';

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
  const url = `/admin/sub-themes/${subThemeId}/games/last-order`;
  try {
    return await requestAdmin({
      url,
      method: 'GET'
    });
  } catch (err) {
    console.error(err) 
  }
}

const GameThemeForm = () => {
  const [selectedTheme, setSelectedTheme] = React.useState<number>(gameStepperStore(state => state.gamePayload.themeId));
  const [themes, setThemes] = React.useState<any>([]);
  const [subThemes, setSubThemes] = React.useState<any>([]);
  const [lastOrderGame, setLastOrderGame] = React.useState<number>(gameStepperStore(state => state.gamePayload.gameOrder));
  const [filteredSubThemes, setFilteredSubThemes] = React.useState(subThemes);
  const [selectedSubTheme, setSelectedSubTheme] = React.useState<number>(gameStepperStore(state => state.gamePayload.subThemeId));
  const setPayload = gameStepperStore(state => state.setPayload);
  const setStepValidation = gameStepperStore(state => state.setValidation);
  const formValidation = React.useState(gameStepperStore(state => state.formValidation));
  const [validation, setValidation] = React.useState<{[key: string]: { valid: boolean }}>({
    theme: {
      valid: (selectedTheme) ? true : false
    },
    subTheme: {
      valid: (selectedSubTheme) ? true : false
    },
  });

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
      keys.forEach((key: string) => {
        if (validation[key].valid) valids++
      })
      setStepValidation('theme', (valids === keys.length));
    }
    handleValidation();
  }, [validation])

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(Number(event.target.value))
    const findTheme = themes.filter((theme: any) => theme.id === Number(event.target.value))[0]
    const filteredSubThemes = subThemes.filter((theme: any) => theme.parentId === findTheme.id);
    setLastOrderGame(0);
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
    setPayload('gameOrder', lastOrder + 1);
    setLastOrderGame(lastOrder + 1);
    setValidation({...validation, subTheme: {valid: true}})
  }

  return (
    <FormGroup>
      <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Theme *</FormLabel>
          <Tooltip title="This is the main theme/podium under which the game will be visible" arrow>
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
                <MenuItem value={theme.id} key={theme.id}>{theme.name}</MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
      <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>Sub Theme *</FormLabel>
          <Tooltip title="This is the main sub-theme/podium under which the game will be visible" arrow>
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
                <MenuItem value={theme.id} key={theme.id}>{theme.name}</MenuItem>
              )
            })
          }
        </Select>
     </FormControl>
     <FormControl sx={{pt: 4}}>
        <Box display="flex">
          <FormLabel sx={{ pb: 2 }}>
            Game Order
          </FormLabel>
          <Tooltip title="This is the default order provided to the Game, this can be changed from Theme section after publishing." arrow>
            <Help sx={{ml: 1}} fontSize="small" />
          </Tooltip>
        </Box>
        <Chip sx={{width: 100}} label={lastOrderGame} color="primary" />
     </FormControl>
    </FormGroup>
  );
}

export default GameThemeForm;
