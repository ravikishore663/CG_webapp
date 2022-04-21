export type FilterValue = {
  field: string
  value: string
}

type FilterBarAction = {
  type: string
  filterValue: FilterValue
}

const initialState: FilterValue = {
  field: '',
  value: ''
}

const filterBarReducer = (state: FilterValue = initialState, action: FilterBarAction) => {
  const { type, filterValue} = action;
  switch(type) {
    case 'SEARCH':
      return {field: filterValue.field, value: filterValue.value}
  }
  return state;
}
export default filterBarReducer;