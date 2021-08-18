let weightEmptyFilter = (value) => {
  if (!value) {
    return "-"
  } else {
    return value + "KG"
  }
}
let formatEmpty = value => {
  if(value){
    return value
  }else {
    return '-'
  }
}
export {weightEmptyFilter,formatEmpty}
