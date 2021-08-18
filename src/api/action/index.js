import request from "../../router/axios"

const prefix='/fitness/pad/action'

//action列表
export const apiActionList=(params)=>{
  return request.get(`${prefix}/type`,{params})
}

export const apiActionDetail=(id)=>{
  return request.get(`${prefix}/${id}`)
}

export const apiSaveActionDetail=(params)=>{
  return request.post(`${prefix}/`,params)
}

export const apiUpdateActionDetail=(params)=>{
  return request.put(`${prefix}/`,params)
}

export const apiDeleteActionDetail=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
