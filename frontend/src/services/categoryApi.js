import { api } from './api';

export const updateCategory = (id, categoryData, userId) => {
  return api.put(`/api/categories/${id}?userId=${userId}`, {
    ...categoryData,
    userId: userId
  });
};

export const deleteCategory = (id, userId) => {
  return api.delete(`/api/categories/${id}?userId=${userId}`);
};