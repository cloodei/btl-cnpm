"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FloatInput } from "@/components/ui/float-input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const DEFAULT_AVATARS = [
  "/astronaut2.png",
  "/astronaut.png",
  "/bear.png",
  "/cat.png",
  "/chicken.png",
  "/dog.png",
  "/meerkat.png",
  "/rabbit.png",
  "/robot.png",
  "/tiger.png",
];

export default function EditProfileModal({ currentUsername, currentImageUrl, userId, allNames, className = "", ...props }) {
  const [username, setUsername] = useState(currentUsername);
  const [selectedImage, setSelectedImage] = useState(currentImageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    for(const name of allNames) {
      if(name.username.toLowerCase() === username.toLowerCase()) {
        toast({
          title: "Error",
          description: "Username already exists!",
          variant: "destructive",
          duration: 2500
        });
        setIsLoading(false);
        setIsEditing(false);
        setUsername(currentUsername);
        return;
      }
    }
    const { success, error } = await updateProfile({ userId, username, imageUrl: selectedImage });
    if(success) {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
        duration: 2500
      });
      router.refresh();
    }
    else {
      toast({
        title: "Error updating profile",
        description: error?.message || error || "An error has occurred",
        variant: "destructive",
        duration: 2500
      });
    }
    setIsLoading(false);
    setIsEditing(false);
  };

  return (
  <>
    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} {...props} className={className}>
      <Settings className="md:w-8 md:h-8 w-[26px] h-[26px]" />
    </Button>

    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="sm:max-w-md" aria-label="Edit Profile" hideClose={isLoading}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          <FloatInput
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Enter your username"
            required
            minLength={3}
            maxLength={64}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_AVATARS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setSelectedImage(url)}
                  className={`p-[2px] rounded-md transition-all w-fit h-fit ${(selectedImage === url) && "bg-primary/10 ring-2 ring-primary"}`}
                >
                  <Avatar className="h-12 w-12 p-[2px]">
                    <AvatarImage src={url} />
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </>
  );
}