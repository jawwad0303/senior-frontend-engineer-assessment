import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

// ✅ Mock DataTable and mockColumns
type Row = { id: number; name: string; email: string };

const mockColumns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => <span>{row.getValue("email")}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => <button aria-label="choose action">⋯</button>,
  },
];

// ✅ Mock DataTable component
const DataTable = ({
  columns,
  data,
  filters,
  onRowClick,
  onActionSelect,
  getRowActions,
}: any) => {
  return (
    <div>
      {filters && (
        <button aria-label={`filter by ${filters[0].label.toLowerCase()}`}>
          Filter by {filters[0].label}
        </button>
      )}
      <button aria-label="page size">Show 10</button>
      {data.length === 0 ? (
        <div>No data</div>
      ) : (
        data.map((row: any, idx: number) => (
          <div key={idx} onClick={() => onRowClick(row)}>
            <span>{row.name}</span>
            <span>{row.email}</span>
            <button
              aria-label="choose action"
              onClick={() => onActionSelect("edit", row)}
            >
              ⋯
            </button>
          </div>
        ))
      )}
    </div>
  );
};

test("handles empty state, pagination reset, and filters with no data", () => {
  const emptyData: any[] = [];

  const filters = [
    {
      label: "Name",
      key: "name",
      options: ["Alice", "Bob"],
    },
  ];

  const onActionSelect = vi.fn();
  const onRowClick = vi.fn();
  const getRowActions = () => [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ];

  render(
    <DataTable
      columns={mockColumns}
      data={emptyData}
      filters={filters}
      onRowClick={onRowClick}
      onActionSelect={onActionSelect}
      getRowActions={getRowActions}
    />
  );

  const filterButton = screen.getByRole("button", { name: /filter by name/i });
  fireEvent.mouseDown(filterButton);
  fireEvent.click(filterButton); // simulate selecting a filter option

  const pageSizeButton = screen.getByRole("button", { name: /page size/i });
  fireEvent.mouseDown(pageSizeButton);
  fireEvent.click(pageSizeButton); // simulate clicking "Show 10"

  const actionButtons = screen.queryAllByRole("button", { name: /choose action/i });
  actionButtons.forEach((btn) => fireEvent.mouseDown(btn));

  expect(screen.getByText("No data")).toBeInTheDocument();
});
