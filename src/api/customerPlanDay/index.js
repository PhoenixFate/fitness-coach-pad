import request from '../../router/axios';

const prefix = '/fitness/pad/customerPlanDay';

export const apiCustomerPlanDayList = params => {
  return request.post(`${prefix}/oneDay`, params);
};

export const apiCustomerPlanDayDetail = id => {
  return request.get(`${prefix}/${id}`);
};

export const apiSaveCustomerPlanDay = params => {
  return request.put(`${prefix}/`, params);
};

export const apiCompleteCustomerPlanDay = params => {
  return request.put(`${prefix}/complete`, params);
};

export const apiPlanDayOneCustomer = customerPlanDayId => {
  return request.get(`${prefix}/customerPlan/${customerPlanDayId}`);
};

export const apiPlanDayOneCustomerHistory = customerPlanDayId => {
  return request.get(`${prefix}/customerPlan/history/${customerPlanDayId}`);
};

export const apiPlanDayOneMonthCount = (year, month) => {
  return request.get(`${prefix}/count/${year}/${month}`);
};

export function vipCustomerCheckin(entity) {
  return request.post(`${prefix}/checkin`, entity);
}
