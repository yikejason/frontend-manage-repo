import { Modal, ModalProps, Spin } from 'antd';
import { FC, memo } from 'react';

interface ModalChild extends ModalProps {
  loading?: boolean;
  modalLoading?: boolean;
  visible?: boolean;
}

const CommonModal: FC<ModalChild> = (props) => {
  return (
    <Modal
      {...props}
      open={props.visible}
      title={props.title}
      onOk={props.onOk}
      onCancel={props.onCancel}
      width={props.width}
      wrapClassName={props.wrapClassName}
      destroyOnClose={true}
      maskClosable={false}
      confirmLoading={props.loading || props.modalLoading || false}
      okText={props.okText || '确定'}
      okButtonProps={props.okButtonProps}
      closable={props.closable}
      centered={props.centered ? props.centered : false}
    >
      <Spin spinning={props.modalLoading || false}>{props.children}</Spin>
    </Modal>
  );
};

export default memo<FC<ModalChild>>(CommonModal);
