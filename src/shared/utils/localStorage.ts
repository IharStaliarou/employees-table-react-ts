import { LOCAL_STORAGE_KEY } from '../constants';
import type { IEmployee } from '../types/employee.interface';

export const loadEmployees = (): IEmployee[] => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Ошибка при загрузке сотрудников:', error);
    return [];
  }
};

export const saveEmployees = (employees: IEmployee[]) => {
  try {
    const serializedState = JSON.stringify(employees);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Ошибка при сохранении сотрудников:', error);
  }
};
