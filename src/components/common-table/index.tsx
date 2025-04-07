import {
  Input,
  Table,
  TablePaginationConfig,
  DatePicker,
  Select,
  InputNumber,
  TimePicker,
  Cascader,
  TreeSelect,
} from 'antd';
import { FC, memo, useEffect, useMemo, useState, useRef } from 'react';
import { TableCustomProps } from './table.types';
import styles from './index.module.less';
import './index.reset.less';
import { Resizable, ResizableProps } from 'react-resizable';
import dayjs from 'dayjs';
import { formatData } from '@/utils/util';
import useTableHeight from '@/hooks/tableHeight';
const { SHOW_CHILD } = Cascader;
type ResizableCustomProps = Partial<ResizableProps>;
interface ResAndTabProps extends ResizableCustomProps, TableCustomProps {
  handleAble?: boolean;
  onRow?: (record: any) => any;
}
interface ResizeProps {
  width: number;
  onResize: () => void;
  onClick: (arg: any) => any;
}
const TableTitle: FC<ResizeProps> = ({
  onClick,
  width,
  onResize,
  ...restProps
}) => {
  if (!width) {
    return <th {...restProps}></th>;
  }
  return (
    <Resizable
      draggableOpts={{ enableUserSelectHack: false }}
      width={width}
      height={0}
      onResize={onResize}
      handle={
        <span
          className={styles['react-resizable-handle']}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
    >
      <th
        {...restProps}
        onClick={(...args) => {
          const data: any = args && args[0];
          const className = data?.target?.className || '';
          if (
            className === 'ant-table-column-sorters' ||
            (typeof className !== 'object' && className.includes('editHeader'))
          ) {
            onClick && onClick(args);
          }
        }}
      ></th>
    </Resizable>
  );
};
const CommonTable: FC<ResAndTabProps> = (props) => {
  // 设置高度
  const tableHeight = useTableHeight();
  // 设置ref
  const formRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reqData, setReqData] = useState({
    page: 1,
    size: 10,
  });
  const [columns, setColumns] = useState<any[]>([]);
  // 搜索条件
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const pagination: TablePaginationConfig = {
    total: props.total || 0,
    showTotal: (total) => <div>共计{total}条</div>,
    onChange: (e, size) => {
      props.changePage && props.changePage(e, size);
      reqData.page = e;
      reqData.size = size;
      setCurrentPage(e);
      setReqData({
        ...reqData,
      });
      props.requestList &&
        props.requestList(Object.assign(props.requestData || {}, reqData));
    },
    pageSizeOptions: ['10', '20', '50', '100'],
    current: props.currentPage || currentPage,
    showQuickJumper: true,
    defaultPageSize: props.defaultPageSize || 10,
    pageSize: reqData.size,
  };
  const noData = () => {
    return (
      <div className={styles['no-data-wrap']}>
        <img
          className={styles['no-data-icon']}
          src={require('@assets/images/no-data.png')}
          alt="暂无数据"
        />
        <p className={styles['no-data-text']}>暂无数据</p>
      </div>
    );
  };
  const components = {
    header: { cell: TableTitle },
  };
  useEffect(() => {
    props.autoActionRequest &&
      props.requestList &&
      props.requestList(props.requestData);
  }, []);
  const resizeHandle =
    (index: number) =>
    (e: any, { size }: any) => {
      try {
        let width = size.width;
        const thDom = e?.target?.offsetParent;
        if (!Object.is(size.width, NaN) && size.width > 20) {
          width = size.width;
        } else {
          if (thDom && thDom.className.includes('react-resizable')) {
            width = thDom.clientWidth;
          }
        }
        columns[index] = { ...columns[index], width: width };
        setColumns([...columns]);
      } catch (err) {
        console.log(err);
      }
    };
  const resizeColumns = useMemo(() => {
    return columns.map((col: any, index: number) => {
      return {
        ...col,
        ellipsis: col.className?.includes('ellipsis'),
        onHeaderCell: (column: any) => {
          return {
            width:
              column.width === 'auto' ? 20 : column.width ? column.width : 20,
            onResize: resizeHandle(index),
            onClick: () => {
              props?.headerClick && props.headerClick();
            },
          };
        },
      };
    });
  }, [columns]);
  useEffect(() => {
    props.resetPage && setCurrentPage(1);
  }, [props.resetPage]);
  const style = {
    marginBottom: '4px',
  };

  // 返回表头
  const headerCustom = useMemo(() => {
    const data = props.columns.map((item: { [key: string]: any }) => {
      const isDate = item.className?.includes('isDate');
      const isDateTime = item.className?.includes('isDateTime');
      const isNumber = item.className?.includes('isNumber');
      const isRangeNum = item.className?.includes('isRangeNum');
      const isTime = item.className?.includes('isTime');
      const isCascader = item.className?.includes('isCascader');
      const isRadio = item.className?.includes('isRadio');
      const showChild = item.className?.includes('showChild');
      const isCost = item.className?.includes('isCost');
      const noClear = item.className?.includes('noClear');
      const casAry = item.className?.includes('casAry');
      const isTreeSelect = item.className?.includes('isTreeSelect');
      const isFieldNames = item.className?.includes('isFieldNames');

      const pickerWithType = (params: any) => {
        if (isDate)
          return (
            <DatePicker.RangePicker
              {...params}
              allowClear={noClear ? false : true}
            />
          );
        if (isTime)
          return (
            <TimePicker.RangePicker
              {...params}
              format="HH:mm"
              allowClear={noClear ? false : true}
            />
          );
      };
      return {
        ...(item.className?.includes('headSearch')
          ? {
              ...item,
              title: (
                <div>
                  <p style={{ textAlign: 'center', marginBottom: '0px' }}>
                    {item.title}
                  </p>
                  {!isDate &&
                    !isNumber &&
                    !isTime &&
                    !isCost &&
                    !item.filters &&
                    !isRangeNum && (
                      <Input
                        ref={formRef}
                        placeholder=""
                        onChange={(e) => {
                          searchParams[item.key] = e.target.value
                            ? e.target.value
                            : undefined;
                          setSearchParams({
                            ...props.initSearch,
                            ...searchParams,
                          });
                        }}
                        onPressEnter={(e) => {
                          e.stopPropagation();
                          props.setSearch &&
                            props.setSearch(
                              { ...props.initSearch, ...searchParams },
                              true,
                            );
                        }}
                        style={{ ...style, display: 'block' }}
                        onBlur={() => {
                          props.setSearch &&
                            props.setSearch(
                              { ...props.initSearch, ...searchParams },
                              false,
                            );
                        }}
                        allowClear={true}
                        defaultValue={
                          props.initSearch
                            ? props.initSearch[item.dataIndex]
                            : undefined
                        }
                      />
                    )}
                  {isNumber && (
                    <InputNumber
                      placeholder=""
                      onChange={(value) => {
                        searchParams[item.key] = value;
                        setSearchParams({
                          ...props.initSearch,
                          ...searchParams,
                        });
                      }}
                      onPressEnter={(e) => {
                        e.stopPropagation();
                        props.setSearch &&
                          props.setSearch(
                            { ...props.initSearch, ...searchParams },
                            true,
                          );
                      }}
                      style={{ ...style, display: 'block' }}
                      onBlur={() => {
                        props.setSearch &&
                          props.setSearch(
                            { ...props.initSearch, ...searchParams },
                            false,
                          );
                      }}
                      controls={false}
                      min={0}
                      precision={0}
                      defaultValue={
                        props.initSearch
                          ? props.initSearch[item.dataIndex]
                          : undefined
                      }
                    />
                  )}
                  {isCost && (
                    <InputNumber
                      placeholder=""
                      onChange={(value) => {
                        searchParams[item.key] = value;
                        setSearchParams({
                          ...props.initSearch,
                          ...searchParams,
                        });
                      }}
                      step={0.01}
                      onPressEnter={(e) => {
                        e.stopPropagation();
                        props.setSearch &&
                          props.setSearch(
                            { ...props.initSearch, ...searchParams },
                            true,
                          );
                      }}
                      style={{ ...style, display: 'block' }}
                      onBlur={() => {
                        props.setSearch &&
                          props.setSearch(
                            { ...props.initSearch, ...searchParams },
                            false,
                          );
                      }}
                      controls={false}
                      min={0}
                      stringMode
                      precision={2}
                      defaultValue={
                        props.initSearch
                          ? props.initSearch[item.dataIndex]
                          : undefined
                      }
                    />
                  )}
                  {isRangeNum && (
                    <div className={styles['cus-input']}>
                      <InputNumber
                        defaultValue={
                          props.initSearch
                            ? props.initSearch[item.dataIndex + 'Start']
                            : undefined
                        }
                        controls={false}
                        min={0}
                        precision={0}
                        onChange={(e) => {
                          searchParams[item.key + 'Start'] = e;
                          setSearchParams({
                            ...props.initSearch,
                            ...searchParams,
                          });
                        }}
                        onPressEnter={(e) => {
                          e.stopPropagation();
                          props.setSearch &&
                            props.setSearch(
                              { ...props.initSearch, ...searchParams },
                              true,
                            );
                        }}
                        onBlur={() => {
                          props.setSearch &&
                            props.setSearch(
                              { ...props.initSearch, ...searchParams },
                              false,
                            );
                        }}
                      />
                      -
                      <InputNumber
                        defaultValue={
                          props.initSearch
                            ? props.initSearch[item.dataIndex + 'End']
                            : undefined
                        }
                        controls={false}
                        min={searchParams[item.key + 'Start'] || 0}
                        precision={0}
                        onChange={(e) => {
                          searchParams[item.key + 'End'] = e;
                          setSearchParams({
                            ...props.initSearch,
                            ...searchParams,
                          });
                        }}
                        onPressEnter={(e) => {
                          e.stopPropagation();
                          props.setSearch &&
                            props.setSearch(
                              { ...props.initSearch, ...searchParams },
                              true,
                            );
                        }}
                        onBlur={() => {
                          props.setSearch &&
                            props.setSearch(
                              { ...props.initSearch, ...searchParams },
                              false,
                            );
                        }}
                      />
                    </div>
                  )}
                  {(isDate || isTime) &&
                    pickerWithType({
                      allowClear: item.defaultFilteredValue ? false : true,
                      defaultValue:
                        props.initSearch && props.initSearch[item.dataIndex]
                          ? [
                              dayjs(props.initSearch[item.dataIndex][0]),
                              dayjs(props.initSearch[item.dataIndex][1]),
                            ]
                          : item.defaultFilteredValue
                          ? [
                              dayjs(item.defaultFilteredValue[0]),
                              dayjs(item.defaultFilteredValue[1]),
                            ]
                          : undefined,
                      onChange: (e: any) => {
                        searchParams[item.key] =
                          e && e[0] && e[1]
                            ? isTime
                              ? [
                                  dayjs(e[0]).format('HH:mm'),
                                  dayjs(e[1]).format('HH:mm'),
                                ]
                              : [
                                  formatData(e[0], isDateTime),
                                  formatData(e[1], isDateTime),
                                ]
                            : undefined;
                        setSearchParams(searchParams);

                        props.setSearch && props.setSearch(searchParams, true);
                      },
                      showTime: isDateTime,
                      placeholder: ['', ''],
                      style: style,
                      separator: '-',
                    })}
                  {item.filters &&
                    (isCascader ? (
                      <Cascader
                        style={{ width: '100%', ...style }}
                        changeOnSelect={true}
                        multiple={true}
                        allowClear={true}
                        maxTagCount={1}
                        maxTagPlaceholder={<span>...</span>}
                        options={item.filters}
                        fieldNames={{
                          label: 'name',
                          value: 'code',
                          children: 'children',
                        }}
                        showCheckedStrategy={showChild ? SHOW_CHILD : undefined}
                        defaultValue={
                          props.initSearch
                            ? props.initSearch[item.dataIndex]
                            : undefined
                        }
                        onChange={(value) => {
                          const req = value.map((arr) => {
                            return arr[arr.length - 1];
                          });
                          searchParams[item.key] = casAry ? value : req;
                          setSearchParams(searchParams);
                          props.setSearch &&
                            props.setSearch(searchParams, true);
                        }}
                      ></Cascader>
                    ) : isTreeSelect ? (
                      <TreeSelect
                        style={{ width: '100%', ...style }}
                        dropdownMatchSelectWidth={false}
                        treeData={item.filters}
                        allowClear={true}
                        treeCheckable={true}
                        maxTagCount={1}
                        maxTagPlaceholder={<span>...</span>}
                        showSearch={false}
                        fieldNames={
                          !isFieldNames
                            ? {
                                label: 'name',
                                value: 'code',
                                children: 'children',
                              }
                            : undefined
                        }
                        multiple={true}
                        showCheckedStrategy={showChild ? SHOW_CHILD : undefined}
                        treeCheckStrictly={true}
                        onChange={(value) => {
                          const req = value.map((arr: any) => {
                            return arr?.value;
                          });
                          searchParams[item.key] = req;
                          setSearchParams(searchParams);
                          props.setSearch &&
                            props.setSearch(searchParams, true);
                        }}
                      ></TreeSelect>
                    ) : (
                      <Select
                        mode={isRadio ? undefined : 'multiple'}
                        style={{ width: '100%', ...style }}
                        maxTagCount={1}
                        maxTagPlaceholder={<span>...</span>}
                        allowClear={true}
                        showArrow={false}
                        onChange={(value) => {
                          searchParams[item.key] = value;
                          setSearchParams(searchParams);
                          props.setSearch &&
                            props.setSearch(searchParams, true);
                        }}
                        defaultValue={
                          props.initSearch
                            ? props.initSearch[item.dataIndex]
                            : undefined
                        }
                        optionFilterProp="children"
                      >
                        {item.filters.map((f: any) => {
                          return (
                            <Select.Option key={f.value}>
                              {f.text}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    ))}
                </div>
              ),
            }
          : {
              ...item,
            }),
        width: 'auto',
        className: 'table-minwidth ' + (item.className || ''),
        ellipsis: item.className?.includes('ellipsis'),
      };
    });
    setColumns(data);
    return data;
  }, [props.columns]);

  return (
    <div className={styles['components-table-resizable-column']}>
      <Table
        components={components}
        columns={!props.handleAble ? resizeColumns : headerCustom}
        dataSource={props.dataSource}
        loading={props.loading}
        pagination={
          props.pagination === false
            ? false
            : props.pagination
            ? props.pagination
            : pagination
        }
        rowClassName={props.rowClassName}
        scroll={{
          ...(props.scroll ? props.scroll : { y: tableHeight }),
          x: props?.allowScrollX ? undefined : 'max-content',
        }}
        rowKey={(record) =>
          props.rowKey
            ? props.noMath
              ? record[props.rowKey]
              : record[props.rowKey] + Math.random()
            : record.id
        }
        rowSelection={props.selection ? props.selection : undefined}
        expandable={props.expandable}
        locale={{
          emptyText: noData,
          ...(props.locale ? props.locale : {}),
        }}
        onChange={props.onChange}
        summary={props.summary}
        bordered={!!props.bordered}
        size={props.size || 'middle'}
        onRow={props.onRow}
        tableLayout={props.tableLayout}
      />
    </div>
  );
};

export default memo(CommonTable);
