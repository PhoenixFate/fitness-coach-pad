import request from "../../router/axios"

const prefix='/fitness/pad/vipCard'

//vip卡列表
export const apiVipCardList=(params)=>{
  return request.get(`${prefix}/`,{params})
}

