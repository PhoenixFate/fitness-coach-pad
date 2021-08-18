import request from "../../router/axios"

const prefix='/fitness/pad/order'

export const apiOrderDetail=(orderNumber)=>{
  return request.get(`${prefix}/number/${orderNumber}`)
}

