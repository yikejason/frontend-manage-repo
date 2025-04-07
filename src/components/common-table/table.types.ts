import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import {
  TableRowSelection,
  TableLocale,
  ExpandableConfig,
} from 'antd/es/table/interface';

export interface TableCustomProps {
  columns: ColumnProps<any>[];
  dataSource: any[];
  loading?: boolean;
  pagination?: false | TablePaginationConfig;
  total?: number;
  changePage?: (e: number, size: number) => void;
  selection?: TableRowSelection<any>;
  currentPage?: number;
  requestList?: (data: any) => void;
  requestData?: object;
  scroll?:
    | ({
        x?: string | number | true | undefined;
        y?: string | number | undefined;
      } & {
        scrollToFirstRowOnChange?: boolean | undefined;
      })
    | undefined;
  defaultExpandAllRows?: boolean;
  autoActionRequest?: boolean;
  defaultExpandedRowKeys?: string[];
  expandedRowKeys?: string[];
  onExpand?: (expanded: boolean, record: any) => void;
  resetPage?: boolean;
  rowKey?: string;
  locale?: TableLocale;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  defaultPageSize?: number;
  setSearch?: (search: Record<string, any>, searchNow?: boolean) => void;
  summary?: any;
  bordered?: boolean;
  rowClassName?: ((record: any) => string) | string;
  noMath?: boolean;
  size?: SizeType;
  expandable?: ExpandableConfig<any> | undefined;
  initSearch?: Record<string, any>;
  headerClick?: (record?: any) => void;
  onRow?: any;
  tableLayout?: 'fixed' | 'auto';
  allowScrollX?: boolean;
}
export interface AllColumnsProps extends ColumnProps<any> {
  children?: any;
}
export type ColumnsProps = AllColumnsProps[];
export type qdTableConfig = (
  queryFn: (record: any) => void,
  deleteFn: (record: any) => void,
  manageFn?: (record: any) => void,
) => ColumnsProps;
