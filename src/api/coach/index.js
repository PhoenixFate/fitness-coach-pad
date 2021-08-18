import request from "../../router/axios"

const prefix = '/fitness/pad/coach'

//登录
export const apiCoachLogin = (params) => {
  return request.post(`${prefix}/login`, params, {headers: {isToken: false}})
}

export const apiCoachByUserId = (userId) => {
  return request.get(`${prefix}/user/${userId}`)
}

export const apiGetCoachInfo = (coachId) => {
  return request.get(`${prefix}/${coachId}`)
}

//coach详情(带目标完成情况)
export const apiGetCoachTarget = (coachId) => {
  return request.get(`${prefix}/target/${coachId}`)
}

export const apiUpdateCoach = (params) => {
  return request.put(`${prefix}/`, params)
}

export const apiChangePassword = (params) => {
  return request.put(`${prefix}/password`, params)
}
