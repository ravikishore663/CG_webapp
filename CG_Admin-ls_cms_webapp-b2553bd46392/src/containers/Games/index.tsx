import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {request, requestAdmin} from '../../utils/request';

import SmartPhone from './../../assets/images/smartphone.png';
import Clock from './../../assets/images/clock.png';
import { Link as LinkRouter } from 'react-router-dom';
import { 
  Badge,
  FormGroup,
  FormControl,
  FormLabel,
  Link,
  Switch,
  TextField
} from '@mui/material';

const Games = () => {
  const [games, setGames] = React.useState<any[]>([]);
  const [active, setACtive] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [activeFilter, setActiveFilter] = React.useState<string>("");


  useEffect(() => {
    // load games
    fetchAllGames();
  }, []);

  const fetchAllGames = (filter = {}) => {
    request({
      url: '/getGameUrl',
      method: 'POST',
      data: {
        id: 13286,
        appVersion: '',
        filter
      }
    })
    .then((data: any) => {
      setGames(data);
    });
  }

  const handleGamesExport = () => {
    requestAdmin({
      url: '/admin/games/export',
      method: 'GET',
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      console.log(url);
      link.setAttribute('download', 'games.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => console.log(error));
  }

  const handleInput = async (input: any) => {
    setInputValue(input.target.value);
    let filter: any = {all: input.target.value}
    if (active) {
      filter.isActive = true;
    }
    fetchAllGames(filter);
    setActiveFilter(input.target.value);
  }

  const switchActive = () => {
    setACtive(!active);
    let filter: any = {all: activeFilter};
    const activeGame = !active;
    if (activeGame) {
      filter = {...filter, isActive: true}
    }
    fetchAllGames(filter);
  }

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <h1 style={{ flex: 1 }}>Games</h1>
        <LinkRouter to='/games/create' className='button' style={{ marginRight: 16 }}>Create</LinkRouter>
        <button type="button" onClick={handleGamesExport} >Export</button>
      </div>

      <FormGroup row>
      <FormControl sx={{ mb: 1, minWidth: 160, mr: 3 }}>
          <TextField variant="outlined" placeholder="Search..." value={inputValue} onChange={(searchValue) => handleInput(searchValue)}/>
        </FormControl>
        <FormGroup>
          <FormLabel>Show Active Game</FormLabel>
          <FormControl>
            <Switch checked={active} onChange={switchActive} name="activeGames" />
          </FormControl>
        </FormGroup>
      </FormGroup>
      
      <div style={{ height: 800, width: '100%' }}>
        <DataGrid
          rows={games}
          columns={columns}
          pageSize={50}
          rowsPerPageOptions={[50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}

const columns = [
  {
    field: 'id',
    headerName: 'Id',
    width: 50,
    editable: true,
  },
  {
    field: 'gameIcon',
    headerName: 'Icon',
    type: 'number',
    width: 100,
    renderCell: (params: any) => {
      if (params.row.gameIcon) {
        return <img src={params.row.gameIcon} alt={params.row.gameTitle} style={{ width: 75, objectFit: 'contain' }} /> 
      }
      return null;
    },
    sortable: false
  },
  {
    field: 'gameTitle',
    headerName: 'Game Name',
    width: 200,
    editable: true,
    renderCell: (params: any) => (
      <>
        <Badge badgeContent=" " variant="dot" color={(params.row.isActive) ? "success" : "warning"}></Badge>
        {params.row.gameUrl ? <Link href={params.row.gameUrl} sx={{ml: 2}} target="_blank" rel="noreferrer">{params.row.gameTitle}</Link> : null}
      </>
    )
  },
  {
    field: 'gameDomain',
    headerName: 'Domain',
    width: 150,
    editable: true,
  },
  {
    field: 'subDomain',
    headerName: 'Sub-Domain',
    width: 150,
    editable: true,
  },
  {
    field: 'minAge',
    headerName: 'Min age',
    type: 'number',
    width: 100,
    editable: true,
    renderCell: (params: any) => <b style={{ fontWeight: 600 }}>{params.row.minAge}</b>,
  },
  {
    field: 'maxAge',
    headerName: 'Max age',
    type: 'number',
    width: 100,
    editable: true,
    renderCell: (params: any) => <b style={{ fontWeight: 600 }}>{params.row.maxAge}</b>,
  },
  {
    field: 'isPortrait',
    headerName: 'Is Portrait',
    type: 'boolean',
    width: 100,
    sortable: false,
    editable: true,
    renderCell: (params: any) => {
      const style: any = { height: 24 };
      let alternateText: string = 'Landscape mode';
      let title: string = 'Landscape mode';
      if (params.row.isPortrait) {
        alternateText = 'Portrait mode';
        title = 'Portrait mode';
      } else {
        style.transform = 'rotate(-90deg)';
      }
      return <img src={SmartPhone} alt={alternateText} title={title} style={style} />;
    },
  },
  {
    field: 'characterName',
    headerName: 'Theme',
    width: 100,
    editable: true,
  },
  {
    field: 'subThemeName',
    headerName: 'Sub-Theme',
    width: 100,
    editable: true,
  },
  {
    field: 'timeToLoad',
    headerName: 'Time to load',
    width: 100,
    editable: true,
    type: 'number',
    renderCell: (params: any) => (
      <>
        <span>{params.row.timeToLoad} sec</span>
        <img src={Clock} alt={`Time to load ${params.row.timeToLoad} seconds`} style={{ height: 16, marginLeft: 8 }} />
      </>
    )
  },
  {
    field: 'gameOrder',
    headerName: 'Order',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'appMinVersion',
    headerName: 'App min Version',
    width: 100,
    editable: true,
  }
];

export default Games;
