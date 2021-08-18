import request from "../../router/axios"

const prefix = '/fitness/pad/gym'

//健身房列表
export const apiGymList = (params) => {
  return request.get(`${prefix}/`, {params})
}

