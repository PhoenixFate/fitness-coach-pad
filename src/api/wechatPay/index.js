import request from "../../router/axios"

const prefix='/fitness/pad/wechat'

export const apiWechatPayPreOrder=(params)=>{
  return request.post(`${prefix}/preOrder`,params)
}

