import CreateDwellingForm from "@/components/Forms/CreateDwellingForm";

export default function CreateDwelling({
  params,
}: {
  params: { objectId: string };
}) {
  return <CreateDwellingForm objectId={params.objectId} />;
}
