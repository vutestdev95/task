import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCallback, useState } from "react";
import { Table } from "./Table";

it("Can render component", async () => {
  render(
    <Table
      bodyColumns={[]}
      dataSource={[]}
      headerColumns={[]}
      idKey="id"
      isLoading
      dataTestId="grid-table"
    />
  );
  const component = await screen.findByTestId("grid-table");
  expect(component).toBeInTheDocument();
});

it("Table can show loading", async () => {
  render(
    <Table
      bodyColumns={[{ renderKey: "id" }, { renderKey: "name" }]}
      dataSource={[]}
      headerColumns={[]}
      idKey="id"
      isLoading={true}
      dataTestId="grid-table"
    />
  );

  const component = await screen.findByTestId("table-loading-1");
  expect(component).toBeInTheDocument();
});

it("Table can show data", async () => {
  render(
    <Table
      bodyColumns={[
        { renderKey: "id" },
        {
          renderKey: "name",
          render: (data: any) => {
            return <div>{data}</div>;
          },
        },
      ]}
      dataSource={[
        { id: 1, name: "anh" },
        { id: 2, name: "austin" },
      ]}
      headerColumns={[
        {
          isSort: true,
          text: "id",
          onClickSortAsc: undefined,
          onClickSortDesc: undefined,
        },
        { isSort: false, text: "name" },
      ]}
      idKey="id"
      dataTestId="grid-table"
      isLoading={false}
    />
  );

  const component = await screen.findByTestId("grid-table");
  expect(component).toBeInTheDocument();

  expect(Array.from(component.querySelectorAll("thead")).length).toEqual(1);
  expect(Array.from(component.querySelectorAll("tbody tr")).length).toEqual(2);
});

it("Table can show data active row", async () => {
  const Component = () => {
    const fnCheckActiveRow = useCallback((row: any) => {
      return row.id === 2;
    }, []);
    return (
      <Table
        bodyColumns={[{ renderKey: "id" }, { renderKey: "name" }]}
        dataSource={[
          { id: 1, name: "anh" },
          { id: 2, name: "austin" },
        ]}
        headerColumns={[
          { isSort: false, text: "id" },
          { isSort: false, text: "name" },
        ]}
        idKey="id"
        dataTestId="grid-table"
        isLoading={false}
        fnCheckActiveRow={fnCheckActiveRow}
        activeRowColor="bg-[#ff0000]"
      />
    );
  };
  render(<Component />);

  const row = await screen.findByTestId("tr-active-row");
  expect(row).toBeInTheDocument();

  const tdIdActive = row.querySelector("td:first-child");
  const text = tdIdActive?.textContent;
  expect(text).toEqual("2");
});

it("can use role attribute", async () => {
  const role = "table";
  render(
    <Table
      bodyColumns={[{ renderKey: "id" }, { renderKey: "name" }]}
      dataSource={[
        { id: 1, name: "anh" },
        { id: 2, name: "austin" },
      ]}
      headerColumns={[
        { isSort: false, text: "id" },
        { isSort: false, text: "name" },
      ]}
      idKey="id"
      dataTestId="grid-table"
      isLoading={false}
      role={role}
    />
  );

  const table = await screen.findByTestId("grid-table");
  const roleAtr = table.getAttribute("role");
  expect(roleAtr).toEqual(role);
});

it("can click row", async () => {
  const role = "table";
  const Component = () => {
    const [activeId, setActiveId] = useState("");
    const fnCheckActiveRow = useCallback(
      (row: any) => {
        return row["id"] === activeId;
      },
      [activeId]
    );
    const onRowClick = useCallback(
      (id: string) => {
        setActiveId(id);
      },
      [setActiveId]
    );
    return (
      <Table
        bodyColumns={[{ renderKey: "id" }, { renderKey: "name" }]}
        dataSource={[
          { id: "1", name: "anh" },
          { id: "2", name: "austin" },
        ]}
        headerColumns={[
          { isSort: false, text: "id" },
          { isSort: false, text: "name" },
        ]}
        idKey="id"
        dataTestId="grid-table"
        isLoading={false}
        role={role}
        fnCheckActiveRow={fnCheckActiveRow}
        onRowClick={onRowClick}
      />
    );
  };
  render(<Component />);

  const table = await screen.findByTestId("grid-table");
  expect(table).toBeInTheDocument();
  const row1 = await screen.findByTestId(`tr-non-active-row-1`);
  expect(row1).toBeInTheDocument();
  userEvent.click(row1);

  const row = await screen.findByTestId("tr-active-row");
  expect(row).toBeInTheDocument();
});

it("can show no data", async () => {
  const role = "table";
  render(
    <Table
      bodyColumns={[{ renderKey: "id" }, { renderKey: "name" }]}
      dataSource={[]}
      headerColumns={[
        { isSort: false, text: "id" },
        { isSort: false, text: "name" },
      ]}
      idKey="id"
      dataTestId="grid-table"
      isLoading={false}
      role={role}
    />
  );

  expect(await screen.findByTestId("table_no_data")).toBeInTheDocument();
});

it("can disable a cell from clicking", async () => {
  const role = "table";
  render(
    <Table
      bodyColumns={[
        { renderKey: "id", isDisableCellClick: true },
        { renderKey: "name" },
      ]}
      dataSource={[
        { id: 1, name: "anh" },
        { id: 2, name: "austin" },
      ]}
      headerColumns={[
        { isSort: false, text: "id" },
        { isSort: false, text: "name" },
      ]}
      idKey="id"
      dataTestId="grid-table"
      isLoading={false}
      role={role}
    />
  );

  expect(await screen.findByTestId("grid-table")).toBeInTheDocument();
  const disabledClickCell = await screen.findByTestId("body_cell_1_id");
  expect(disabledClickCell).toBeInTheDocument();
  fireEvent.click(disabledClickCell);
});
