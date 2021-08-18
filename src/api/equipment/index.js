import request from "../../router/axios"

const prefix='/fitness/pad/equipment'

export const apiEquipmentList=(params)=>{
  return request.get(`${prefix}/`,{params})
}

export const apiSaveEquipment=(params)=>{
  return request.post(`${prefix}/`,params)
}

export const apiUpdateEquipment=(params)=>{
  return request.put(`${prefix}/`,params)
}

export const apiDeleteEquipment=(params)=>{
  return request.delete(`${prefix}/batch`,{data:params})
}
