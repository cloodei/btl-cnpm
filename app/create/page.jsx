import CreateComponent from "@/components/create-page";
import { auth } from "@clerk/nextjs/server";

export default async function CreatePage() {
  const { userId } = await auth();
  
  if(!userId) {
    return <div>Not logged in</div>;
  }

  return <CreateComponent userId={userId} />;
}
