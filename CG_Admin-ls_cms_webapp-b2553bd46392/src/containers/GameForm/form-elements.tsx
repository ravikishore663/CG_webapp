import React from 'react';
import Box from '@mui/material/Box';
import { 
  FormControl,
  Select,
  TextField,
  MenuItem,
  InputLabel,
  Slider,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Input,
  Button
} from '@mui/material';

import FormConfig from './form-config';

type FormElementProps = {
  activeStep: Number | string | any,
  state?: any,
  onChange?: Function
};

const renderFormField = (element: any, handlers: any) => {
  if (!element.type) {
    return <TextField
      id={element.htmlId}
      aria-describedby={element.label} 
      label={element.label}
      defaultValue={element.value}
      {...handlers}
    />
  }
  const fieldComponentMap: any = {
    select: renderSelectComponent,
    slider: renderSlider,
    radio: renderRadioGroup,
    file: renderFileUpload
  };
  const renderFunction = fieldComponentMap[element.type];
  return renderFunction && renderFunction(element, handlers);
};

const renderSelectComponent = (element: any, handlers: any) => {
  const control = (
    <React.Fragment>
      <InputLabel id={element.htmlId}>{element.label}</InputLabel>
      <Select
        labelId={element.htmlId}
        id={element.htmlId}
        value={element.value}
        label={element.label}
        onChange={handleSelectChange(element.key)}
        {...handlers}
      >
        {element.options.map((record: any) => <MenuItem key={record.value} value={record.value}>{record.label}</MenuItem>)}
      </Select>
    </React.Fragment>
  );
  return control;
};

const renderSlider = (element: any, handlers: any) => {
  return (
    <React.Fragment>
      <Typography id={element.id} gutterBottom>
        {element.label}
      </Typography>
      <Slider { ...element } {...handlers} />
    </React.Fragment>
  );
}

const renderRadioGroup = (element: any, handlers: any) => {
  return (
    <React.Fragment>
      <FormLabel id={element.id}>{element.label}</FormLabel>
      <RadioGroup
        aria-labelledby={element.id}
        defaultValue={element.defaultValue}
        name={element.key}
        row
        {...handlers}
      >
        {
          element.options.map((option: any) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))
        }
      </RadioGroup>
    </React.Fragment>
  )
}

const renderFileUpload = (element: any, handlers: any) => {
  return (
    <FormControl>
      <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor={element.id}>
        <Input id={element.id} type="file" {...handlers} />
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
    </Stack>
    </FormControl>
  )
}

const handleSelectChange = (key: string) => () => {
  // do nothing
}

const FormElements = (props: FormElementProps) => {
  const [config, setConfig] = React.useState(FormConfig[props.activeStep]);

  React.useEffect(() => {
    setConfig(FormConfig[props.activeStep]);
  }, [props.activeStep]);

  const handlers: any = {
    name: {
      onChange: props.onChange
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiFormControl-root': { marginTop: 4, width: '100ch' },
        '& .MuiTextField-root': { marginTop: 0 }
      }}
      noValidate
      autoComplete="off"
    >
      {config.elements.map((element: any) => {
        return (
          <FormControl key={element.id}>
            {renderFormField(element, handlers[element.key])}
          </FormControl>
        )
      })}
    </Box>
  );
}

export default FormElements;
