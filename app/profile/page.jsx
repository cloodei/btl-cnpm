// 'use client';

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useClerk } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useUser } from "@clerk/nextjs";

// export function ProfileComponent() {
//   const { signOut } = useClerk();
//   const router = useRouter();
//   const { isLoaded, isSignedIn, user } = useUser();

//   const handleSignOut = async () => {
//     await signOut();
//     router.push("/login");
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card className="max-w-2xl mx-auto p-6 space-y-6">
//         <div className="flex items-center space-x-4">
//           {user.imageUrl && (
//             <div className="relative w-20 h-20 rounded-full overflow-hidden">
//               <Image 
//                 src={user.imageUrl}
//                 alt="Profile"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           )}
//           <div>
//             <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
//             <p className="text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <h2 className="font-semibold mb-2">Account Details</h2>
//             <p>Username: {user.username}</p>
//             <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
//           </div>

//           <Button 
//             variant="destructive" 
//             onClick={handleSignOut}
//             className="w-full sm:w-auto"
//           >
//             Sign Out
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }
import ProfileComponent from "@/components/user-component"
import { getUserInfo } from "../actions/user";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
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