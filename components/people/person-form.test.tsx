import type { Person } from "@/types/workforce"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PersonForm } from "./person-form"

const person: Person = {
  id: "P-1",
  firstName: "Amelia",
  lastName: "Hart",
  email: "amelia@structa.test",
  phone: "+1 555 0100",
  jobTitle: "Designer",
  department: "Product",
  employmentStatus: "Active",
  classification: "Professional",
  location: "London",
}

test("shows required validation", async () => {
  const user = userEvent.setup()
  render(<PersonForm person={{ ...person, firstName: "", lastName: "" }} />)
  await user.click(screen.getByRole("button", { name: /save changes/i }))
  expect(await screen.findByText("First name is required")).toBeInTheDocument()
  expect(screen.getByText("Last name is required")).toBeInTheDocument()
})

test("rejects invalid email", async () => {
  const user = userEvent.setup()
  render(<PersonForm person={person} />)
  const email = screen.getByLabelText(/work email/i)
  await user.clear(email)
  await user.type(email, "not-an-email")
  await user.click(screen.getByRole("button", { name: /save changes/i }))
  expect(
    await screen.findByText("Enter a valid work email")
  ).toBeInTheDocument()
})

test("submits valid values", async () => {
  const user = userEvent.setup()
  const onSaved = jest.fn()
  render(<PersonForm person={person} onSaved={onSaved} />)
  await user.click(screen.getByRole("button", { name: /save changes/i }))
  await waitFor(
    () =>
      expect(onSaved).toHaveBeenCalledWith(
        expect.objectContaining({ email: "amelia@structa.test" })
      ),
    { timeout: 2000 }
  )
})
