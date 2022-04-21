import React, { useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Stack,
  ButtonGroup,
  Popper,
  Grow,
  MenuItem,
  MenuList,
  ClickAwayListener,
  CircularProgress,
  Alert,
  Backdrop
} from '@mui/material';
import VideoDetailForm from '../../components/Forms/VideoDetail';
import ThemeForm from '../../components/Forms/Themes';
import VideoUploader from '../../components/Forms/VideoUploader';
import TechMeta from '../../components/Forms/TechMeta';
import { videoStepperStore } from '../../zstore';
import { TryRounded } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {request, requestAdmin, commonRequest} from '../../utils/request';
import { useNavigate } from "react-router-dom";

const saveOptions = ['Save & Publish', 'Save & Mark Inactive'];

const CreateVideoStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    {
      label: 'Video Details',
      component: <VideoDetailForm />,
      valid: videoStepperStore(state => state.formValidation.videoDetail)
    },
    {
      label: 'Theme & Sub-Theme',
      component: <ThemeForm />,
      valid: videoStepperStore(state => state.formValidation.theme),
    },
    {
      label: 'Video Meta',
      component: <VideoUploader />,
      valid: videoStepperStore(state => state.formValidation.meta),
    },
    {
      label: 'Tech Meta',
      component: <TechMeta />,
      valid: videoStepperStore(state => state.formValidation.tech),
    },
  ];
  const [activeComponent, setActiveComponent] = React.useState<JSX.Element | undefined>(steps[0].component);
  const videoPayload = videoStepperStore(state => state.videoPayload);
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorExist, setErrorExist] = React.useState<any>();
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigate = useNavigate();
  const resetVideoPayload = videoStepperStore(state => state.resetPayload);

  const handleNext = () => {
    const activeField = steps[activeStep+1];
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeField) {
      setActiveComponent(activeField.component);
    } else {
      setActiveComponent(undefined);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setActiveComponent(steps[activeStep - 1].component)
  };

  const handleReset = () => {
    setActiveStep(0);
    setActiveComponent(steps[0].component)
  };

  const handleClick = () => {
    console.info(`You clicked ${saveOptions[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleError = (error: any) => {
    if (error.status >= 400) {
      setErrorExist(error);
      setTimeout(
        () => setErrorExist(undefined), 
        3000
      );
    }
  }

  const handleSaveAsDraft = async (type = 'draft') => {
    const params = videoPayload.videoTitle.toLowerCase().split(" ");
    const videoObject: {[key: string]: any} = {
      videoName: videoPayload.videoTitle,
      // avcHlsUrl: "http://videourl.com/video/videonew-1.html",
      // videoHlsUrl: "http://videourl.com/video/videonew-1.html",
      videoDomain: videoPayload.domain,
      subThemeName: videoPayload.subThemeName,
      subThemeId: videoPayload.subThemeId,
      videoLength: videoPayload.videoLength,
      startTime: videoPayload.startEnd[0],
      endTime: videoPayload.startEnd[1],
      // searchTag: "searchTag",
      // viewTag: "viewTag",
      // isEbook: true,
      isActive: type === 'publish' ? true : false,
      experienceId: videoPayload.themeId,
      experienceName: videoPayload.themeName,
      videoOrder: videoPayload.videoOrder ,
      videoParameter: params.join("_"),
      // videoIcon: "https://icon.com",
      isRhyme: false,
      minVersion: videoPayload.minVersion,
      vendorId: videoPayload.vendorId,
      minAge: videoPayload.ages[0],
      maxAge: videoPayload.ages[1],
      // iconVideo: videoPayload.iconFile
      // quizId: 199
    }

    if (type !== 'draft') {
      Object.assign(videoObject, {iconFile: videoPayload.iconFile, videoFile: videoPayload.videoFile})
    } else {
      Object.assign(videoObject, {videoToDraft: videoPayload.videoFile})
    }

    const keys = Object.keys(videoObject);
    const data = new FormData();
    keys.map((key: string) => {
      data.append(key, videoObject[key]);
    })
    setSubmitting(true);

    if (type === 'draft') {
      try {
        await requestAdmin({
            url: '/admin/videos/draft',
            method: 'POST',
            headers: { "Content-Type": "multipart/form-data" },
            data
        });

        setSubmitting(false);
        resetVideoPayload();
        navigate('/videos');
        setSuccess(true);

      } catch (error) {
        setSubmitting(false);
        handleError(error)
      }
    } else {
      try {
        await requestAdmin({
          url: '/admin/videos/publish',
          method: 'POST',
          headers: { "Content-Type": "multipart/form-data" },
          data
        });

        setSubmitting(false);
        resetVideoPayload();
        navigate('/videos');
        setSuccess(true);

      } catch (error: any) {
        setSubmitting(false);
        handleError(error)
      }
    }
  }


  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={submitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ml: 13, mr: 13, mb: 5}}>
        {
          (errorExist) ? 
            <Alert variant="outlined" color="error" severity="error">
              {errorExist.message}
            </Alert>
          :
            <></>
        }
        {
          (success) ? 
            <Alert variant="outlined" color="success" severity="success">
              Video is drafted successfully! The video is uploading in the Background
            </Alert>
          :
            <></>
        }
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <h1 style={{ flex: 1 }}>Add Video</h1>
          <Stack spacing={2} direction="row">
          </Stack>
        </div>
      </Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel {...labelProps}>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
      <Box sx={{pt: 2, pl: 13, pr: 13, display: 'flex', flexDirection: 'row'}}>
        <Box sx={{ minWidth: '50%' }}>
          {activeComponent}
        </Box>
        <Box>
        </Box>
        {/* ACTIVE COMPONENT */}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        {
          (activeStep > 0) ? <Button variant="outlined"  sx={{ mr: 2 }} onClick={handleBack}>
            Back
          </Button> : <></>
        }
        {
          (activeStep === steps.length - 1) ? 
          <>
          <ButtonGroup disabled={!steps[activeStep].valid} variant="contained" ref={anchorRef} aria-label="split button">
            <Button onClick={() => handleSaveAsDraft(selectedIndex ? 'inactive' : 'publish')} disabled={(submitting)}>{saveOptions[selectedIndex]}</Button>
            <Button
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {saveOptions.map((option: string, index: number) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          </> 
          : 
          <Button disabled={!steps[activeStep].valid} variant="outlined"  sx={{ mr: 13 }} onClick={handleNext}>
            Next
          </Button>
        }
      </Box>
    </Box>
  );
}
export default CreateVideoStepper;