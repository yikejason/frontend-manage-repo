import {
  InputProps,
  FormItemProps,
  FormProps,
  RowProps,
  ColProps,
  DatePickerProps,
  TimePickerProps,
  SelectProps,
  SwitchProps,
} from 'antd';
import { Attributes, ReactNode } from 'react';
export type FormsProps = FormItemProps &
  InputProps &
  SelectProps<any> &
  Attributes;
export type RowsProps = RowProps;
export interface OptionsProps {
  value: string | number;
  name: string | number;
}
export type FormConfig =
  | {
      type: any;
      props?: any;
      children?: FormConfig[] | FormConfig | string;
    }
  | undefined;
export enum InputType {
  formitem = 'formitem',
  input = 'input',
  inputnumber = 'inputnumber',
  button = 'button',
  row = 'row',
  col = 'col',
  datepicker = 'datepicker',
  timePicker = 'timePicker',
  select = 'select',
  treeSelect = 'treeSelect',
  textarea = 'textarea',
  password = 'password',
  upload = 'upload',
  checkbox = 'checkbox',
  rangepicker = 'rangepicker',
  radiogroup = 'radiogroup',
  radio = 'radio',
  switch = 'switch',
  list = 'list',
  pictureUpload = 'pictureUpload',
  fileUpload = 'fileUpload',
  cascader = 'cascader',
  table = 'table',
}
export interface FormDefaultProps extends FormProps {
  formConfig: Array<FormConfig>;
  useRow?: boolean;
  rowConfig?: RowProps;
  colConfig?: ColProps;
  pikcerConfig?: DatePickerProps;
  timePikcerConfig?: TimePickerProps;
  uploadChildren?: ReactNode[] | string[] | JSX.Element[];
  viewModal?: boolean;
  noDefault?: boolean;
}
export interface CompoundedComponent
  extends React.ForwardRefExoticComponent<
    SwitchProps & React.RefAttributes<HTMLElement>
  > {
  __ANT_SWITCH: boolean;
}
