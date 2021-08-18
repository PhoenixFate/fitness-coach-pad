import request from "../../router/axios"

const prefix='/fitness/pad/exercise'

export const apiExerciseList=(params)=>{
  return request.get(`${prefix}/`,{params})
}

export const apiExerciseListWithDetail=(params)=>{
  return request.get(`${prefix}/detail`,{params})
}

export const apiExerciseDetail=(id)=>{
  return request.get(`${prefix}/${id}`)
}

export const apiSaveExercise=(params)=>{
  return request.post(`${prefix}`,params)
}

export const apiUpdateExercise=(params)=>{
  return request.put(`${prefix}`,params)
}

export const apiDeleteExercise=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
