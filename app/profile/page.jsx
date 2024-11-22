import ProfileComponent from "@/components/user-component"
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { getCachedUserInfo } from "../actions/user";

const fetchUser = async () => {
  const { userId } = await auth();
  const user = await getCachedUserInfo(userId);
  return user;
}

export default async function ProfilePage() {
  const result = await fetchUser();
  if(!result.success) {
    return <div>Error: {result.error.message}</div>;
  }

  return (
    <Suspense fallback={<div className="m-auto p-10 text-center text-4xl font-medium">Loading...</div>}>
      <ProfileComponent userData={result.user} />
    </Suspense>
  );
}