import { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Popconfirm,
} from 'antd';
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
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        date: initialValues.date
          ? dayjs(initialValues.date).format(DATE_FORMAT)
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
        <Popconfirm
          key='back'
          title={`Вы уверены, что хотите ${
            initialValues ? UI_FIELDS.cancelEditing : UI_FIELDS.cancelCreating
          } ?`}
          onConfirm={onCancel}
          okText='Да'
          cancelText='Нет'
        >
          <Button>Отмена</Button>
        </Popconfirm>,
        <Button key='submit' type='primary' onClick={handleSubmit(onSubmit)}>
          {initialValues ? 'Сохранить изменения' : 'Добавить'}
        </Button>,
      ]}
    >
      <Form layout='vertical'>
        <Form.Item
          label='Имя'
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
          label='Дата'
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
                value={field.value ? dayjs(field.value) : null}
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
              <InputNumber {...field} style={{ width: '100%' }} />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
