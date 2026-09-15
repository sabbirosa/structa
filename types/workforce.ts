export type EmploymentStatus = "Active" | "On leave" | "Inactive"
export type EmploymentType = "Full-time" | "Part-time" | "Contract"
export type ClassificationStatus = "Active" | "Archived"

export interface Person {
  id: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  department: string
  employmentStatus: EmploymentStatus
  classification: string
  location: string
  phone: string
}

export interface Employment {
  id: string
  personId: string
  employee: string
  position: string
  department: string
  employmentType: EmploymentType
  startDate: string
  endDate: string | null
  status: EmploymentStatus
  manager: string
}

export interface Classification {
  id: string
  name: string
  code: string
  description: string
  status: ClassificationStatus
  assignedPeople: number
  lastUpdated: string
}
