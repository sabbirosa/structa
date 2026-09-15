import { useRoleStore } from "@/stores/role-store"
import { render, screen } from "@testing-library/react"
import { Can } from "./can"

test("admin sees edit actions and viewer cannot edit", () => {
  useRoleStore.setState({ role: "ADMIN" })
  const { rerender } = render(
    <Can permission="person.edit">
      <button>Edit person</button>
    </Can>
  )
  expect(
    screen.getByRole("button", { name: "Edit person" })
  ).toBeInTheDocument()
  useRoleStore.setState({ role: "VIEWER" })
  rerender(
    <Can permission="person.edit">
      <button>Edit person</button>
    </Can>
  )
  expect(
    screen.queryByRole("button", { name: "Edit person" })
  ).not.toBeInTheDocument()
})

test("manager can edit employment but not classifications", () => {
  useRoleStore.setState({ role: "MANAGER" })
  render(
    <>
      <Can permission="employment.edit">
        <button>Edit employment</button>
      </Can>
      <Can permission="classification.edit">
        <button>Edit classification</button>
      </Can>
    </>
  )
  expect(
    screen.getByRole("button", { name: "Edit employment" })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("button", { name: "Edit classification" })
  ).not.toBeInTheDocument()
})
