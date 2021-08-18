import request from "../../router/axios"

const prefix='/fitness/pad/mealType'

export const apiMealTypeList=(params)=>{
  return request.get(`${prefix}/`,{params})
}
