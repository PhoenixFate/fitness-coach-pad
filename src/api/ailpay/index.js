import request from "../../router/axios"

const prefix='/fitness/pad/alipay'

export const apiAlipayPreOrder=(params)=>{
  return request.post(`${prefix}/preOrder`,params)
}

