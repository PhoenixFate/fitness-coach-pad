import request from "../../router/axios"

const prefix='/fitness/pad/dietPlan'

export const apiDietPlanList=(params)=>{
  return request.get(`${prefix}/`,{params})
}

export const apiDietPlanDetail=(id)=>{
  return request.get(`${prefix}/${id}`)
}

export const apiSaveDietPlan=(params)=>{
  return request.post(`${prefix}/`,params)
}

export const apiUpdateDietPlan=(params)=>{
  return request.put(`${prefix}/`,params)
}

export const apiDeleteDietPlan=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
