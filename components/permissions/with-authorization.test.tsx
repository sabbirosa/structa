import { render, screen } from "@testing-library/react"
import { withAuthorization } from "./with-authorization"
import { useRoleStore } from "@/stores/role-store"

function ProtectedScreen() {
  return <h1>Protected workforce screen</h1>
}

const Screen = withAuthorization(ProtectedScreen, {
  permission: "person.edit",
})

const demoUser = {
  id: "P-0001",
  name: "Jordan Davis",
  department: "Operations",
}

beforeEach(() => {
  useRoleStore.setState({ user: demoUser, role: "ADMIN" })
})

test("renders the protected screen for an authenticated authorized role", () => {
  render(<Screen />)
  expect(
    screen.getByRole("heading", { name: "Protected workforce screen" })
  ).toBeInTheDocument()
})

test("shows the authentication fallback without a current user", () => {
  useRoleStore.setState({ user: null })
  render(<Screen />)
  expect(
    screen.getByRole("heading", { name: "Sign in to continue" })
  ).toBeInTheDocument()
})

test("shows the authorization fallback when the role lacks permission", () => {
  useRoleStore.setState({ role: "VIEWER" })
  render(<Screen />)
  expect(
    screen.getByRole("heading", { name: /don’t have permission/i })
  ).toBeInTheDocument()
})
