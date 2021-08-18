import request from "../../router/axios"

const prefix='/fitness/pad/trainingPlan'

export const apiTrainingPlanList=(params)=>{
  return request.get(`${prefix}`,{params})
}
export const apiTrainingPlanListWithDetail=()=>{
  return request.get(`${prefix}/detail`)
}

export const apiTrainingPlanDetail=(id)=>{
  return request.get(`${prefix}/${id}`)
}

export const apiSaveTrainingPlan=(params)=>{
  return request.post(`${prefix}`,params)
}

export const apiUpdateTrainingPlan=(params)=>{
  return request.put(`${prefix}`,params)
}

export const apiDeleteTrainingPlan=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
