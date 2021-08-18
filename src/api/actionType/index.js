import request from "../../router/axios"

const prefix='/fitness/pad/actionType'

export const apiActionTypeList=(params)=>{
  return request.get(`${prefix}/`,{params})
}

export const apiSaveActionType=(params)=>{
  return request.post(`${prefix}/`,params)
}

export const apiUpdateActionType=(params)=>{
  return request.put(`${prefix}/`,params)
}

export const apiDeleteActionType=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
