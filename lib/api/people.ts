import type { Person } from "@/types/workforce"

export const peopleApi = {
  get: async (id: string) => {
    const response = await fetch(`/api/people?id=${encodeURIComponent(id)}`)
    if (!response.ok) throw new Error("The person could not be loaded.")
    return response.json() as Promise<Person | null>
  },
  update: async (person: Person) => {
    const response = await fetch("/api/people", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    })
    if (!response.ok) throw new Error("The person could not be saved.")
    return response.json() as Promise<Person>
  },
}
