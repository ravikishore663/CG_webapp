import React, { ChangeEvent, FC, useEffect } from "react";
import { FormGroup, TextField, Button, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { connect, useSelector, useDispatch } from "react-redux";
import { FilterValue } from "./filterBarReducer";
import { searchByFilter } from "../../../actions/filterBarAction";

interface FilterBarProps {
  fields: Array<string>;
}

const FilterBar: FC<FilterBarProps> = (props) => {

  
  const [age, setAge] = React.useState<string>("")
  const { field, value } = useSelector((state: any) => state.filterBarReducer)
  const dispatch = useDispatch()
  
  const handleChange = (fieldValue: SelectChangeEvent<any>) => {
    dispatch(
      searchByFilter(fieldValue.target.value, value)
      )
    }
    
    const handleInput = (searchValue: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(
        searchByFilter(field, searchValue.target.value)
        )
      }
      

  return (
    <>
      <FormGroup row>
        <FormControl sx={{ mt: 1,  minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={field}
            label="Filter By"
            onChange={(selected) => handleChange(selected)}
          >
            {
              props.fields.map((field, index) => {
                return (
                  <MenuItem key={index} value={field}>{field}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 160 }}>
          <TextField variant="outlined" placeholder="Search..." value={value} onChange={(searchValue) => handleInput(searchValue)}/>
        </FormControl>
      </FormGroup>
    </>
  )
}

export default FilterBar;