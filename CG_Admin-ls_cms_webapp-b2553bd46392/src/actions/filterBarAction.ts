import { FilterValue } from "../components/Grid/FilterBar/filterBarReducer"

export const searchByFilter = (field: string, value: string) => {
  console.log(field);
  return({
    type: "SEARCH",
    filterValue: {field, value}
  })
}
//   export const delTodo = data => {
//     return({
//       type: "DEL",
//       palyload: data
//     })
//   }