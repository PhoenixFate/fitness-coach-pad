import request from '../../router/axios';

const prefix = '/fitness/pad/customer';

export const apiCustomerList = params => {
  return request.get(`${prefix}`, { params });
};

export const apiCustomerNotVipList = params => {
  return request.get(`${prefix}/notVip`, { params });
};

export const apiCustomerDetail = id => {
  return request.get(`${prefix}/${id}`);
};

export const apiCustomerInfo = id => {
  return request.get(`${prefix}/base/${id}`);
};

export const apiSaveCustomer = params => {
  return request.post(`${prefix}/`, params);
};

export const apiUpdateCustomer = params => {
  return request.put(`${prefix}`, params);
};

export const apiUpdateCustomerCommon = params => {
  return request.put(`${prefix}/base`, params);
};

export const apiBodyTestList = customerId => {
  return request.get(`${prefix}/bodyTest/${customerId}`);
};

export const apiUpdateBodyTest = params => {
  return request.put(`${prefix}/bodyTest`, params);
};

export const apiSaveBodyTest = params => {
  return request.post(`${prefix}/bodyTest`, params);
};

export const apiBodyStatusList = customerId => {
  return request.get(`${prefix}/bodyStatus/${customerId}`);
};

export const apiUpdateBodyStatus = params => {
  return request.put(`${prefix}/bodyStatus`, params);
};

export const apiSaveBodyStatus = params => {
  return request.post(`${prefix}/bodyStatus`, params);
};

export const apiDietPlanList = customerId => {
  return request.get(`${prefix}/dietPlan/${customerId}`);
};

export const apiSaveDietPlan = params => {
  return request.post(`${prefix}/dietPlan`, params);
};

export const apiUpdateDietPlan = params => {
  return request.put(`${prefix}/dietPlan`, params);
};

export const apiCustomerPlanList = customerId => {
  return request.get(`${prefix}/customerPlan/${customerId}`);
};

export function syncDeviceData(customerId) {
  return request.get(`${prefix}/${customerId}/sync-body-test`);
}
