import {
  createElement,
  ReactNode,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useState,
} from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  FormInstance,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Select,
  TreeSelect,
  Cascader,
  Upload,
  Checkbox,
  Radio,
  Switch,
  Modal,
  Table,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FormDefaultProps, FormConfig, InputType } from './form.types';
import { PlusOutlined } from '@ant-design/icons';
import pathEnv from '../../../env';
import { getLocalStorage } from '@/utils/util';
const { List } = Form;
import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
const formConfig = (noDefault?: boolean) => {
  return {
    [InputType.formitem]: { type: Form.Item, defaultProps: {} },
    [InputType.input]: { type: Input, defaultProps: { allowClear: true } },
    [InputType.inputnumber]: { type: InputNumber, defaultProps: {} },
    [InputType.button]: { type: Button, defaultProps: {} },
    [InputType.row]: { type: Row, defaultProps: {} },
    [InputType.col]: { type: Col, defaultProps: {} },
    [InputType.datepicker]: {
      type: DatePicker,
      defaultProps: noDefault
        ? {}
        : {
            getPopupContainer: () =>
              document.querySelector('.ant-modal-body .ant-form') ||
              document.querySelector('.ant-form'),
          },
    },
    [InputType.timePicker]: {
      type: TimePicker,
      defaultProps: noDefault
        ? {}
        : {
            getPopupContainer: () =>
              document.querySelector('.ant-modal-body .ant-form') ||
              document.querySelector('.ant-form'),
          },
    },
    [InputType.select]: {
      type: Select,
      defaultProps: noDefault
        ? {}
        : {
            getPopupContainer: () =>
              document.querySelector('.ant-modal-body .ant-form') ||
              document.querySelector('.ant-form'),
          },
    },
    [InputType.textarea]: {
      type: Input.TextArea,
      defaultProps: { allowClear: true },
    },
    [InputType.password]: { type: Input.Password, defaultProps: {} },
    [InputType.upload]: { type: Upload.Dragger, defaultProps: {} },
    [InputType.checkbox]: { type: Checkbox.Group, defaultProps: {} },
    [InputType.rangepicker]: {
      type: DatePicker.RangePicker,
      defaultProps: noDefault
        ? {}
        : {
            getPopupContainer: () =>
              document.querySelector('.ant-modal-body .ant-form') ||
              document.querySelector('.ant-form'),
          },
    },
    [InputType.radio]: { type: Radio, defaultProps: {} },
    [InputType.radiogroup]: { type: Radio.Group, defaultProps: {} },
    [InputType.switch]: { type: Switch, defaultProps: {} },
    [InputType.list]: { type: List, defaultProps: {} },
    [InputType.pictureUpload]: { type: Upload.Dragger, defaultProps: {} },
    [InputType.fileUpload]: { type: Upload.Dragger, defaultProps: {} },
    [InputType.cascader]: { type: Cascader, defaultProps: {} },
    [InputType.table]: { type: Table, defaultProps: {} },
    [InputType.treeSelect]: { type: TreeSelect, defaultProps: {} },
  };
};
/**
 *
 * @param props
 * @param ref
 * @returns
 */
const RefWrapperForm: ForwardRefRenderFunction<
  FormInstance,
  FormDefaultProps
> = (props, ref) => {
  const [previewVisible, setVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const handleCancel = () => {
    setVisible(false);
  };
  const getConfig = (
    type: InputType,
  ): {
    type: any;
    defaultConfig: Record<string, any>;
  } => {
    return {
      type: formConfig(props.noDefault)[type].type,
      defaultConfig: formConfig(props.noDefault)[type].defaultProps,
    };
  };
  const genElement = (
    type: InputType | string,
    elprops: any,
    key?: string | number,
    children?: FormConfig[] | FormConfig | string,
  ): ReactNode => {
    const disabledFlag: boolean = props?.viewModal
      ? !!props.viewModal
      : elprops?.disabled
      ? !!elprops.disabled
      : false;
    const elementType =
      type in InputType ? getConfig(type as InputType).type : type;
    const defaultProps =
      type in InputType ? getConfig(type as InputType).defaultConfig : {};
    if (type === InputType.select) {
      const selectElement = createElement(
        elementType,
        elprops
          ? {
              ...defaultProps,
              ...elprops,
              disabled: !!disabledFlag,
            }
          : { disabled: !!disabledFlag },
        children &&
          (children as any[]).map((item: any) => {
            return genElement(
              item.type,
              item.props,
              item.props.value,
              item.props.children,
            );
          }),
      );
      return selectElement;
    }
    if (type === 'treeSelect') {
      return createElement(
        TreeSelect,
        elprops
          ? { ...elprops, disabled: !!disabledFlag }
          : { disabled: !!disabledFlag },
      );
    }
    if (type === 'cascader') {
      return createElement(
        Cascader,
        elprops
          ? { ...elprops, disabled: !!disabledFlag }
          : { disabled: !!disabledFlag },
      );
    }
    if (type === 'table') {
      return createElement(
        Table,
        elprops
          ? { ...elprops, disabled: !!disabledFlag }
          : { disabled: !!disabledFlag },
      );
    }
    if (type === 'upload') {
      const token = getLocalStorage('ytoken');
      return createElement(
        Upload.Dragger,
        elprops
          ? {
              ...elprops,
              action: `${pathEnv}/milk-card/api/milk-card/card/file/upload`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {},
        props.uploadChildren
          ? props.uploadChildren
          : [
              <PlusOutlined style={{ fontSize: 50, color: '#555' }} key="1" />,
              <p style={{ marginTop: 30 }} key="2">
                点击上传图片或者拖拽图片至区域内
              </p>,
              <p style={{ fontSize: 12, color: '#999999' }} key="3">
                小于2m，JPG或PNG格式，建议像素638 X 334或相同比例
              </p>,
            ],
      );
    }
    if (type === 'pictureUpload') {
      return (
        <>
          <Upload
            {...elprops}
            onPreview={async (file: UploadFile) => {
              const getBase64 = (file: RcFile): Promise<string> =>
                new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = (error) => reject(error);
                });
              if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as RcFile);
              }
              setPreviewImage(file.url || (file.preview as string));
              setVisible(true);
            }}
            disabled={disabledFlag}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
          {elprops.hideDesc ? (
            <></>
          ) : (
            <span
              style={{
                ...elprops.style,
              }}
              key="2"
            >
              {elprops.desc}
            </span>
          )}
          <Modal
            open={previewVisible}
            title={'预览图片'}
            footer={null}
            onCancel={handleCancel}
            width="70%"
            wrapClassName="table-modal"
          >
            <img
              alt="example"
              style={{ maxWidth: '100%', margin: '0 auto', display: 'block' }}
              src={previewImage}
            />
          </Modal>
        </>
      );
    }
    if (type === 'fileUpload') {
      return createElement(Upload, { ...elprops }, [
        <Button
          disabled={elprops.disabled}
          icon={elprops.icon ? elprops.icon : <UploadOutlined />}
          key="1"
          type="primary"
        >
          {elprops.btnText || '上传附件'}
        </Button>,
        elprops.hideDesc ? (
          <></>
        ) : (
          <span
            style={{
              ...elprops.style,
              position: 'absolute',
              fontSize: '12px',
              marginLeft: '20px',
              top: '8px',
            }}
            key="2"
          >
            {elprops.desc === '' ? '' : elprops.desc || '仅支持PDF格式'}
          </span>
        ),
      ]);
    }
    const element = createElement(
      elementType,
      {
        key,
        ...defaultProps,
        ...(typeof type === 'string'
          ? { ...elprops, disabled: disabledFlag }
          : { ...elprops }),
      },
      children &&
        (Array.isArray(children)
          ? children.map(
              (item, index) =>
                item &&
                genElement(
                  item.type,
                  item.props,
                  item.props && item.props.name ? item.props.name : index,
                  item.children,
                ),
            )
          : typeof children === 'string'
          ? children
          : genElement(
              children.type,
              children?.props,
              undefined,
              children?.children,
            )),
    );
    return element;
  };
  return (
    <Form
      layout={props.layout}
      wrapperCol={props.wrapperCol || { span: 16 }}
      labelCol={props.labelCol || { span: 6 }}
      ref={ref}
      initialValues={props.initialValues}
      className={props.className}
      labelAlign={props.labelAlign || 'right'}
    >
      <>
        {props.useRow ? (
          <Row {...props.rowConfig}>
            {props.formConfig.map((item: FormConfig, index: number) => {
              return (
                <Col {...props.colConfig} key={index}>
                  {item &&
                    genElement(
                      item.type,
                      item.props,
                      item.props && item.props.name ? item.props.name : index,
                      item.children,
                    )}
                </Col>
              );
            })}
          </Row>
        ) : (
          props.formConfig.map((item: FormConfig, index: number) => {
            return (
              item &&
              genElement(
                item.type,
                item.props,
                item.props && item.props.name ? item.props.name : index,
                item.children,
              )
            );
          })
        )}
        {props.children}
      </>
    </Form>
  );
};
const CommonForm = memo(forwardRef(RefWrapperForm));
export default CommonForm;
