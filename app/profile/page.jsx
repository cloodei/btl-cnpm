import ProfileComponent from "@/components/user-component"
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { getCachedUserInfo } from "../actions/user";
import { FancySpinner } from "@/components/ui/fancy-spinner";

async function PageWrapper() {
  try {
    const { userId } = await auth();
    if(!userId) {
      throw new Error("User not found");
    }
    const result = await getCachedUserInfo(userId);
    if(!result.success) {
      throw new Error("Error fetching user data");
    }
    return (
      <ProfileComponent userData={result.user} />
    )
  }
  catch(error) {
    return (
      <div className="m-auto p-10 text-center text-4xl font-medium">
        {error.message ? error.message : (error ? error : "An error occurred")}
      </div>
    );
  }
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={(
      <div className="m-auto p-10 text-center text-4xl font-medium">
        <FancySpinner text="Loading decks..." size={26} />
      </div>
    )}>
      <PageWrapper />
    </Suspense>
  );
}