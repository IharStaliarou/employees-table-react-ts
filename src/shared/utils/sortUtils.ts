import dayjs from 'dayjs';

import type { IEmployee } from '../types/employee.interface';

export const sortbyName = (a: IEmployee, b: IEmployee) =>
  a.name.localeCompare(b.name);

export const sortByDate = (a: IEmployee, b: IEmployee) =>
  dayjs(a.date).valueOf() - dayjs(b.date).valueOf();

export const sortBySalary = (a: IEmployee, b: IEmployee) => a.salary - b.salary;
