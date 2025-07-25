import { z } from 'zod';

export const employeeSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Имя должно содержать не менее 2 символов' }),
  date: z.string().min(1, { message: 'Дата обязательна' }),
  salary: z
    .number()
    .min(0, { message: 'Значение должно быть неотрицательным' }),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
