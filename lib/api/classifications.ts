import type { Classification } from "@/types/workforce"

export const classificationsApi = {
  save: async (classification: Classification) => {
    const response = await fetch("/api/classifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classification),
    })
    if (!response.ok) throw new Error("The classification could not be saved.")
    return response.json() as Promise<Classification>
  },
}
