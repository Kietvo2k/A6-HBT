import YearbookApp from "@/components/YearbookApp";
import { getYearbookContent } from "@/lib/yearbook-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const yearbookContent = await getYearbookContent();

  return <YearbookApp yearbookContent={yearbookContent} />;
}
