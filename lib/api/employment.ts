import type { Employment } from "@/types/workforce"

export const employmentApi = {
  get: async (id: string) => {
    const response = await fetch(`/api/employment?id=${encodeURIComponent(id)}`)
    if (!response.ok)
      throw new Error("The employment record could not be loaded.")
    return response.json() as Promise<Employment | null>
  },
  update: async (record: Employment) => {
    const response = await fetch("/api/employment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
    if (!response.ok)
      throw new Error("The employment record could not be saved.")
    return response.json() as Promise<Employment>
  },
}
