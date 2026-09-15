import { PersonDetails } from "@/components/people/person-details"

export default async function PersonDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PersonDetails id={id} />
}
