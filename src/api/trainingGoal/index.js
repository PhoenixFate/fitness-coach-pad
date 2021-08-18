import request from "../../router/axios"

const prefix='/fitness/pad/trainingGoal'

export const apiTrainingGoalList=(params)=>{
  return request.get(`${prefix}/`,{params})
}
