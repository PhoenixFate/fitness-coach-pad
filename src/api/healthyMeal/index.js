import request from "../../router/axios"

const prefix='/fitness/pad/healthyMeal'

export const apiHealthyMealList=(params)=>{
  return request.get(`${prefix}/`,{params})
}

export const apiHealthyMealDetail=(id)=>{
  return request.get(`${prefix}/${id}`)
}

export const apiSaveHealthyMeal=(params)=>{
  return request.post(`${prefix}/`,params)
}

export const apiUpdateHealthyMeal=(params)=>{
  return request.put(`${prefix}/`,params)
}

export const apiDeleteHealthyMeal=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
