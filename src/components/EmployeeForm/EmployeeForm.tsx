import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { employeeSchema, type EmployeeFormData } from './employeeSchema';
import { DATE_FORMAT } from '../../shared/constants';
import { UI_FIELDS } from '../../shared/constants/fields';

interface EmployeeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmitEmployee: (data: EmployeeFormData) => void;
  initialValues?: EmployeeFormData | null;
}

const EmployeeForm = ({
  visible,
  onCancel,
  onSubmitEmployee,
  initialValues,
}: EmployeeFormProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialValues || { name: '', date: '', salary: 0 },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        date: initialValues.date
          ? dayjs(initialValues.date, DATE_FORMAT).format(DATE_FORMAT)
          : '',
      });
    } else {
      reset({ name: '', date: '', salary: 0 });
    }
  }, [initialValues, reset, visible]);

  const onSubmit = (data: EmployeeFormData) => {
    onSubmitEmployee(data);
    reset();
  };

  return (
    <Modal
      title={
        initialValues ? UI_FIELDS.employeeEditing : UI_FIELDS.employeeCreating
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key='back' onClick={onCancel}>
          Отмена
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit(onSubmit)}>
          {initialValues ? UI_FIELDS.confirmSaveEmployee : 'Добавить'}
        </Button>,
      ]}
    >
      <Form layout='vertical'>
        <Form.Item
          label={UI_FIELDS.name}
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder='Введите имя' />
            )}
          />
        </Form.Item>
        <Form.Item
          label={UI_FIELDS.date}
          validateStatus={errors.date ? 'error' : ''}
          help={errors.date?.message}
        >
          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <DatePicker
                placeholder='Выберите дату'
                format={DATE_FORMAT}
                value={field.value ? dayjs(field.value, DATE_FORMAT) : null}
                onChange={(_, dateString) => field.onChange(dateString)}
                style={{ width: '100%' }}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={UI_FIELDS.salary}
          validateStatus={errors.salary ? 'error' : ''}
          help={errors.salary?.message}
        >
          <Controller
            name={'salary'}
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                onChange={(value) =>
                  field.onChange(value === null ? undefined : value)
                }
                style={{ width: '100%' }}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
