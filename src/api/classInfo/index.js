import request from "../../router/axios"

const prefix='/fitness/pad/classInfo'

export const apiClassInfoList=(params)=>{
  return request.get(`${prefix}`,{params})
}

export const apiClassInfoDetail=(id)=>{
  return request.get(`${prefix}/${id}`)
}

export const apiClassInfoListWithDetail=()=>{
  return request.get(`${prefix}/detail`)
}

export const apiSaveClassInfo=(params)=>{
  return request.post(`${prefix}`,params)
}

export const apiUpdateClassInfo=(params)=>{
  return request.put(`${prefix}`,params)
}

export const apiDeleteClassInfo=(id)=>{
  return request.delete(`${prefix}/${id}`)
}
