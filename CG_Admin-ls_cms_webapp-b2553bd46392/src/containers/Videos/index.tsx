import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {request, requestAdmin} from '../../utils/request';
import Clock from './../../assets/images/clock.png';
import { Link as LinkRouter } from 'react-router-dom';

import { 
  FormGroup, 
  TextField, 
  FormControl, 
  Modal,
  Box,
  Switch,
  FormLabel,
  Link,
  Badge
} from '@mui/material';
import HlsPlayer from './../../components/HlsPlayer'

type Video = {
    videoId: number,
    videoIcon: string,
    videoName: string,
    avcHlsUrl: string,
    videoHlsUrl: string,
    videoDomain: string,
    isEbook: boolean,
    searchTag: string,
    viewTag: string,
    isActive: boolean,
    experienceId: number,
    experienceName: string,
    subThemeId: number,
    subThemeName: string,
    vendorId: number,
    isRhyme: boolean,
    videoParameter: string,
    minAge: number,
    maxAge: number,
    videoOrder: number,
    quizId: number,
    starTime: number,
    endTime: number,
    minVersion: string
}

const fetchAllVideos = async (filter = {}) => {
  const url = '/getAllVideos';
  try {
    return await request({
      url,
      method: 'POST',
      data: {
        id: 13286,
        overrideAll: true,
        filter
      }
    });
  } catch (err) {
    console.error(err) 
  }
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const handleVideosExport = () => {
  requestAdmin({
    url: '/admin/videos/export',
    method: 'GET',
    responseType: 'blob',
  })
  .then((response) => {
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'videos.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  })
  .catch((error) => console.log(error));
}

const Videos = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [hlsUrl, setHlsUrl] = React.useState<string>("");
  const [activeFilter, setActiveFilter] = React.useState<string>("");
  const [active, setACtive] = React.useState<boolean>(false);

  useEffect(() => {
    const getVideoList = async () => {
      const data = await fetchAllVideos();
      setVideos(data);
    }

    getVideoList();
  }, []);

  const handleInput = async (input: any) => {
    setInputValue(input.target.value);
    let filter: any = {all: input.target.value}
    if (active) {
      filter.isActive = true;
    }
    const data = await fetchAllVideos(filter);
    setActiveFilter(input.target.value);
    setVideos(data);
  }

  const handleClose = () => {
    setOpen(false);
    setHlsUrl("");
  }

  const switchActive = async () => {
    setACtive(!active);
    let activeVideo = !active;
    let filter: any = {all: activeFilter};
    if (activeVideo) {
      filter = {...filter, isActive: true}
    }
    const data = await fetchAllVideos(filter);
    setVideos(data);
  }

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <h1 style={{ flex: 1 }}>Videos</h1>
        <LinkRouter to='/videos/create' className='button' style={{ marginRight: 16 }}>Create</LinkRouter>
        <button type="button" onClick={handleVideosExport} >Export</button>
      </div>
      <FormGroup row>
        <FormControl sx={{ mb: 1, minWidth: 160, mr: 3 }}>
          <TextField variant="outlined" placeholder="Search..." value={inputValue} onChange={(searchValue) => handleInput(searchValue)}/>
        </FormControl>
        <FormGroup>
          <FormLabel>Show Active Video</FormLabel>
          <FormControl>
            <Switch checked={active} onChange={switchActive} name="gilad" />
          </FormControl>
        </FormGroup>
      </FormGroup>
      <div style={{ height: 800, width: '100%' }}>
        <DataGrid
          rows={videos}
          columns={[
            {
              field: 'videoId',
              headerName: 'Id',
              width: 50,
              editable: true
            },
            {
              field: 'videoIcon',
              headerName: 'Icon',
              type: 'number',
              width: 100,
              renderCell: (params: any) => {
                if (params.row.videoIcon) {
                  return <img src={params.row.videoIcon} style={{ width: 75, objectFit: 'contain' }} />
                }
                return null;
              },
              sortable: false
            },
            {
              field: 'videoName',
              headerName: 'Video Title',
              width: 200,
              renderCell: (params: any) => (
                <>
                  <Badge badgeContent=" " variant="dot" color={(params.row.isDraft) ? "warning" : (params.row.isActive) ? "success" : "error"}></Badge>
                  <Link sx={{ml: 2}} component="button" onClick={() => {
                    setOpen(true)
                    setHlsUrl(params.row.avcHlsUrl)
                  }}>{params.row.videoName}</Link>
                </>
              )
            },
            {
              field: 'videoDomain',
              headerName: 'Domain',
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
              field: 'experienceName',
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
              field: 'start_time',
              headerName: 'Start Time',
              width: 100,
              editable: true,
              type: 'number',
              renderCell: (params: any) => (
                <>
                  <span>{params.row.startTime} sec</span>
                  <img src={Clock} alt={`Start Time of video ${params.row.videoId}`} style={{ height: 16, marginLeft: 8 }} />
                </>
              )
            },
            {
              field: 'end_time',
              headerName: 'End Time',
              width: 100,
              editable: true,
              type: 'number',
              renderCell: (params: any) => (
                <>
                  <span>{params.row.endTime} sec</span>
                  <img src={Clock} alt={`End Time of video ${params.row.videoId}`} style={{ height: 16, marginLeft: 8 }} />
                </>
              )
            },
            {
              field: 'videoOrder',
              headerName: 'Order',
              type: 'number',
              width: 100,
              editable: true,
            },
            {
              field: 'minVersion',
              headerName: 'App min Version',
              width: 100,
              editable: true,
            }
          ]}
          pageSize={50}
          getRowId={(row) => row.videoId}
          rowsPerPageOptions={[50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <HlsPlayer hlsUrl={hlsUrl} />
        </Box>
      </Modal>
    </div>
  );
}

export default Videos;