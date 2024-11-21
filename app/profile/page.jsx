import ProfileComponent from "@/components/user-component"
import { getUserInfo } from "../actions/user";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const { userId } = await auth();
  if(!userId) {
    return <div>Not authorized!!</div>;
  }
  try {
    const { user } = await getUserInfo(userId);
    return <ProfileComponent userData={user} />;
  }
  catch(err) {
    return <div>Error loading profile... Try again later</div>;
  }
}