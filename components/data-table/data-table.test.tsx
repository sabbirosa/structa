import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DataTable, type ColumnDef, type DataGridFeatures } from "./data-table"
import { SortableHeader } from "./sortable-header"

interface Row {
  id: string
  name: string
  team: string
}
const rows: Row[] = [
  { id: "1", name: "Zara", team: "Design" },
  { id: "2", name: "Amelia", team: "Engineering" },
  { id: "3", name: "Noah", team: "Engineering" },
  { id: "4", name: "Maya", team: "People" },
  { id: "5", name: "Elias", team: "Finance" },
  { id: "6", name: "Sofia", team: "Operations" },
]
const columns: ColumnDef<DataGridFeatures, Row>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  { accessorKey: "team", header: "Team" },
]

function renderTable() {
  return render(
    <DataTable
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      pageSize={5}
      search={{ accessors: [(row) => row.name] }}
    />
  )
}

test("renders records and filters by global search", async () => {
  const user = userEvent.setup()
  renderTable()
  expect(screen.getByText("Zara")).toBeInTheDocument()
  await user.type(
    screen.getByRole("textbox", { name: "Search records" }),
    "Amelia"
  )
  expect(screen.getByText("Amelia")).toBeInTheDocument()
  expect(screen.queryByText("Zara")).not.toBeInTheDocument()
})

test("sorts records", async () => {
  const user = userEvent.setup()
  renderTable()
  await user.click(screen.getByRole("button", { name: "Sort by Name" }))
  const body = screen.getAllByRole("rowgroup")[1]
  expect(within(body).getAllByRole("row")[0]).toHaveTextContent("Amelia")
})

test("paginates records", async () => {
  const user = userEvent.setup()
  const onQueryChange = jest.fn()
  render(
    <DataTable
      data={rows.slice(0, 5)}
      totalCount={6}
      onQueryChange={onQueryChange}
      columns={columns}
      getRowId={(row) => row.id}
      pageSize={5}
      search={{ accessors: [(row) => row.name] }}
    />
  )
  await user.click(screen.getByRole("button", { name: /go to page 2/i }))
  await waitFor(() =>
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ pageIndex: 1, pageSize: 5 })
    )
  )
})
