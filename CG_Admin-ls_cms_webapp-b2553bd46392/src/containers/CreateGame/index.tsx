import React, { useEffect } from 'react';
import {
  Box,
  Alert,
  Stack,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  ButtonGroup,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import GameDetailForm from '../../components/Forms/GameDetail';
import GameThemeForm from '../../components/Forms/GameThemeForm';
import GameUploader from '../../components/Forms/GameUploader';
import GameTechMeta from '../../components/Forms/GameTechMeta';
import { gameStepperStore } from '../../zstore';
import { requestAdmin } from '../../utils/request';
import { useNavigate } from 'react-router-dom';

const saveOptions = ['Save & Publish', 'Save & Mark Inactive'];

const CreateGameStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    {
      label: 'Game Details',
      component: <GameDetailForm />,
      valid: gameStepperStore(state => state.formValidation.gameDetail)
    },
    {
      label: 'Theme & Sub-Theme',
      component: <GameThemeForm />,
      valid: gameStepperStore(state => state.formValidation.theme),
    },
    {
      label: 'Game Meta',
      component: <GameUploader />,
      valid: gameStepperStore(state => state.formValidation.meta),
    },
    {
      label: 'Tech Meta',
      component: <GameTechMeta />,
      valid: gameStepperStore(state => state.formValidation.tech),
    }
  ];
  const [success, setSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [activeComponent, setActiveComponent] = React.useState<JSX.Element | undefined>(steps[0].component);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('') ;
  const gamePayload = gameStepperStore(state => state.gamePayload);
  const navigate = useNavigate();
  const resetGamePayload = gameStepperStore(state => state.resetPayload);

  const formatGameData = () => {
    const params = gamePayload.gameTitle.toLowerCase().split(" ");
    const gameObject: {[key: string]: any} = {
      gameTitle: gamePayload.gameTitle,
      gameDomain: gamePayload.domain,
      minAge: gamePayload.ages[0],
      maxAge: gamePayload.ages[1],
      isPortrait: gamePayload.isPortrait,
      isActive: false,
      subThemeName: gamePayload.subThemeName,
      subThemeId: gamePayload.subThemeId,
      experienceId: gamePayload.themeId,
      experienceName: gamePayload.themeName,
      gameOrder: gamePayload.gameOrder,
      appMinVersion: gamePayload.minVersion,
      timeToLoad: gamePayload.loadTime,
      searchTag: gamePayload.searchTag,
      viewTag: gamePayload.viewTag,
      isHtml: gamePayload.isHtml || true,
      gameFile: gamePayload.gameFile,
      iconFile: gamePayload.iconFile,
      gameParameter: params.join('_')
    };
    const keys = Object.keys(gameObject);
    const data = new FormData();
    keys.forEach((key: string) => {
      data.append(key, gameObject[key]);
    });
    return data;
  }
  // const handleSaveAsDraft = async () => {
  //   const data = formatGameData();
  //   data.delete('gameFiles');
  //   setSubmitting(true);
  //   const response = await requestAdmin({
  //     url: '/admin/games/draft',
  //     method: 'POST',
  //     headers: { "Content-Type": "multipart/form-data" },
  //     data
  //   });
  //   setSubmitting(false);
  //   setSuccess(true);
  // }

  const handleOtherSaveOptions = async() => {
    setError('');
    const options: any = [{
      sendFiles: true,
      isActive: true,
    }, {
      sendFiles: true,
      isActive: false,
    }];
    const data = formatGameData();
    const option = options[selectedIndex];
    if (!option.sendFiles) {
      data.delete('gameFiles');
    }
    data.set('isActive', option.isActive);
    setSubmitting(true);
    try {
      await requestAdmin({
        url: '/admin/games/save',
        method: 'POST',
        headers: { "Content-Type": "multipart/form-data" },
        data
      });
      setSubmitting(false);
      setSuccess(true);
      navigate('/games');
      resetGamePayload();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  }

  const handleReset = () => {
    setActiveStep(0);
    resetGamePayload();
    setActiveComponent(steps[0].component);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setActiveComponent(steps[activeStep - 1].component);
  };

  const handleClick = () => {
    console.info(`You clicked ${saveOptions[selectedIndex]}`);
    handleOtherSaveOptions();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleNext = () => {
    const activeField = steps[activeStep + 1];
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeField) {
      setActiveComponent(activeField.component);
    } else {
      setActiveComponent(undefined);
    }
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

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Box sx={{ml: 13, mr: 13, mb: 5}}>
        {
          (success) ?
            <>
              <Alert variant="outlined" color="success" severity="success">
                  Game is drafted successfully! The game is uploading in the Background
              </Alert>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>All steps completed - you&apos;re finished</Typography>
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reset
                  </Button>
                </Paper>
              )}
            </>
          :
            <></>
        }
        {
          (error) && <Alert variant="outlined" color="error" severity="error">{error}</Alert>
        }
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <h1 style={{ flex: 1 }}>Add Game</h1>
          <Stack spacing={2} direction="row">
            {/*<Button variant="outlined" onClick={handleSaveAsDraft} disabled={(submitting)}>
              Save as Draft
              {
                (submitting) ? <CircularProgress sx={{ml: 2}} size={20} /> : <></>
              }
            </Button>*/}
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
            <Button onClick={handleClick}>{saveOptions[selectedIndex]}</Button>
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
};

export default CreateGameStepper;
