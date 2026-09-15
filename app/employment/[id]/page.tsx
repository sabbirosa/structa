import { EmploymentDetails } from "@/components/employment/employment-details"

export default async function EmploymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EmploymentDetails id={id} />
}
