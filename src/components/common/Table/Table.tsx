import clsx from "clsx";
import { isFunction } from "lodash";
import React, { MouseEventHandler, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ThSort } from "./ThSort";

export type HeaderColumnType = (
  | {
      isSort: true;
      onClickSortAsc?: MouseEventHandler;
      onClickSortDesc?: MouseEventHandler;
    }
  | {
      isSort: false;
    }
) & {
  text: string;
  className?: string;
};

export type BodyColumnType = {
  render?: Function;
  renderKey: string;
  isDisableCellClick?: boolean;
  tdClassName?: string;
};

interface TableProps {
  isLoading: boolean;
  dataSource: any[];
  headerColumns: HeaderColumnType[];
  bodyColumns: BodyColumnType[];
  idKey: string;
  onRowClick?: (id: string) => void;
  role?: string;
  defaultRowColor?: string;
  hoverRowColor?: string;
  activeRowColor?: string;
  fnCheckActiveRow?: (row: any) => boolean;
  dataTestId?: string;
}

const getLoadingContent = ({
  bodyColumns,
}: {
  bodyColumns: BodyColumnType[];
}) => {
  return Array.from({ length: 5 })
    .map((item: any, index: number) => ({ ...item, idKey: index }))
    .map((value: any) => (
      <tr key={value.idKey} data-testid={`table-loading-${value.idKey}`}>
        {Array.from(Array(bodyColumns.length).keys()).map((cell) => (
          <td key={cell}>
            <div className="px-1 py-1 ">
              <Skeleton height={30} />
            </div>
          </td>
        ))}
      </tr>
    ));
};

const NoData = ({ bodyColumns }: { bodyColumns: BodyColumnType[] }) => {
  return (
    <tr>
      <td colSpan={bodyColumns.length}>
        <div className="px-2 py-8 text-center ">
          <span
            data-testid="table_no_data"
            className="text-center text-gray-500"
          >
            No data found
          </span>
        </div>
      </td>
    </tr>
  );
};

const Table: React.FC<TableProps> = ({
  isLoading,
  dataSource,
  headerColumns,
  bodyColumns,
  idKey,
  onRowClick,
  role,
  dataTestId,
  defaultRowColor = "bg-white",
  hoverRowColor = "hover:bg-[#F5F8FB]",
  activeRowColor = "bg-[#F5F8FB]",
  fnCheckActiveRow,
}) => {
  const renderBody = () => {
    if (isLoading) {
      return getLoadingContent({ bodyColumns });
    }

    if (dataSource.length === 0) {
      return <NoData bodyColumns={bodyColumns} />;
    }

    return dataSource.map((row) => {
      return (
        <Row
          key={row[idKey]}
          fnCheckActiveRow={fnCheckActiveRow}
          row={row}
          idKey={idKey}
          hoverRowColor={hoverRowColor}
          onRowClick={onRowClick}
          activeRowColor={activeRowColor}
          defaultRowColor={defaultRowColor}
          bodyColumns={bodyColumns}
        />
      );
    });
  };

  return (
    <div className="overflow-x-auto relative w-full ">
      <table
        data-testid={dataTestId}
        role={role}
        className="w-full text-left table-auto border border-[#CBD0DF] rounded-[6px]"
      >
        <thead>
          <tr className="">
            {headerColumns.map((headerColumn, index) => (
              <React.Fragment key={headerColumn.text}>
                {headerColumn.isSort ? (
                  <ThSort
                    onClickSortAsc={
                      headerColumn.onClickSortAsc
                        ? headerColumn.onClickSortAsc
                        : undefined
                    }
                    onClickSortDesc={
                      headerColumn.onClickSortDesc
                        ? headerColumn.onClickSortDesc
                        : undefined
                    }
                    text={headerColumn.text}
                    isAlignRight={index === headerColumns.length - 1}
                    className={headerColumn.className}
                  />
                ) : (
                  <th
                    className={clsx(
                      "py-3 px-4 bg-white text-[#000A44] font-medium text-[15px] leading-[18px] border-b border-b-[#CBD0DF] ",
                      headerColumn.className
                    )}
                  >
                    {headerColumn.text}
                  </th>
                )}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
};

export { Table };

const Row = ({
  fnCheckActiveRow,
  row,
  idKey,
  hoverRowColor,
  onRowClick,
  activeRowColor,
  defaultRowColor,
  bodyColumns,
}: {
  row: any;
  bodyColumns: BodyColumnType[];
  idKey: string;
  onRowClick?: (id: string) => void;
  defaultRowColor?: string;
  hoverRowColor?: string;
  activeRowColor?: string;
  fnCheckActiveRow?: (row: any) => boolean;
  dataTestId?: string;
}) => {
  const handleClickRow = useCallback(() => {
    isFunction(onRowClick) && onRowClick(row[idKey]);
  }, [idKey, onRowClick, row]);
  return (
    <tr
      data-testid={(() => {
        if (isFunction(fnCheckActiveRow)) {
          return fnCheckActiveRow(row)
            ? "tr-active-row"
            : `tr-non-active-row-${row[idKey]}`;
        }
        return `tr-non-active-row-${row[idKey]}`;
      })()}
      onClick={handleClickRow}
      className={clsx(
        hoverRowColor,
        isFunction(onRowClick) && "cursor-pointer",
        (() => {
          if (isFunction(fnCheckActiveRow)) {
            return fnCheckActiveRow(row) ? activeRowColor : defaultRowColor;
          }
          return "";
        })()
      )}
    >
      {bodyColumns.map(
        ({ renderKey, render, tdClassName, isDisableCellClick }) => {
          const dataRow = row[renderKey];
          return (
            <Cell
              key={renderKey}
              row={row}
              renderKey={renderKey}
              isDisableCellClick={isDisableCellClick}
              tdClassName={tdClassName}
              render={render}
              dataRow={dataRow}
              idKey={idKey}
            />
          );
        }
      )}
    </tr>
  );
};

const Cell = ({
  row,
  renderKey,
  isDisableCellClick,
  tdClassName,
  render,
  dataRow,
  idKey,
}: {
  row: any;
  renderKey: string;
  isDisableCellClick: boolean | undefined;
  tdClassName?: string;
  render?: Function;
  dataRow: any;
  idKey: string;
}) => {
  const handleClickCell = useCallback(
    (e) => {
      isDisableCellClick && e.stopPropagation();
    },
    [isDisableCellClick]
  );

  return (
    <td
      data-testid={`body_cell_${row[idKey]}_${renderKey}`}
      onClick={handleClickCell}
      style={{
        boxShadow: "inset 0px -1px 0px #CBD0DF",
      }}
      className={clsx(
        `py-3 px-4 text-black text-xs leading-[125%]`,
        isDisableCellClick && "cursor-default",
        tdClassName
      )}
    >
      {render ? render(dataRow, row) : dataRow}
    </td>
  );
};
