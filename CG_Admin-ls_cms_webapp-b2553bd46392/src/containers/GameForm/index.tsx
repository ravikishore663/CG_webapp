import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import FormElements from './form-elements';

const steps = [
  { id: 1, label: 'Game Details' },
  { id: 2, label: 'Game Theme' },
  { id: 3, label: 'Game Meta' },
  { id: 4, label: 'Tech Meta' },
];

const GameForm = () => {
  const [activeStep, setActiveStep] = React.useState<string | string | any>(0);
  const [formState, setFormState] = React.useState({});

  const handleDraftClick = () => {
    setActiveStep(activeStep + 1);
  }

  const handlePrevClick = () => {
    setActiveStep(activeStep - 1);
  }

  const handleNextClick = () => {
    setActiveStep(activeStep + 1);
  }

  const handleFormValueChange = (key: string, value: any) => {
    setFormState({ [key]: value });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <h1 style={{ flex: 1 }}>Add Game</h1>
        <Stack spacing={2} direction="row">
          <Button variant="outlined" onClick={handleDraftClick}>Draft</Button>
          <Button variant="contained">Inactive</Button>
          <Button variant="contained" color="error">Publish</Button>
        </Stack>
      </div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div
      style={{ margin: '24px 96px' }}>
        <FormElements
          activeStep={activeStep}
          state={formState}
          onChange={handleFormValueChange} />
          <div style={{ marginTop: 32, textAlign: 'end' }}>
            <Stack spacing={2} direction="row">
              <Button variant="outlined" onClick={handlePrevClick} disabled={activeStep === 0}>Prev</Button>
              <Button variant="outlined" onClick={handleNextClick} disabled={activeStep === steps.length}>Next</Button>
            </Stack>
          </div>
      </div>
    </Box>
  );
}

export default GameForm;
