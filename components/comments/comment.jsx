import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment, deleteComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTimeIndicator } from "@/lib/utils";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const generateNameInitials = (name) => {
  let initials = (name[0]).toUpperCase();
  for(let i = 1; i < name.length; i++) {
    if(name[i] === ' ' && name[i + 1] !== ' ') {
      initials += (name[++i]).toUpperCase();
    }
  }
  return initials;
}

export default function Comment({ comment, permission }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.comment);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.deck_id] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating comment",
        description: error?.message || error || "Something went wrong",
        variant: "destructive",
        duration: 2500
      });
      setEditedText(comment.comment);
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', comment.deck_id] }),
    onError: (error) => {
      toast({
        title: "Error deleting comment",
        description: error?.message || error || "Something went wrong",
        variant: "destructive",
        duration: 2500
      });
    }
  });

  const handleEdit = () => {
    const edited = editedText.trim();
    if(edited === comment.comment) {
      setIsEditing(false);
      return;
    }
    updateMutation.mutate({ commentId: comment.id, comment: edited });
  }

  const handleCancel = () => {
    setEditedText(comment.comment);
    setIsEditing(false);
  }
  
  return (
    <div className="flex gap-4 p-4 border-b">
      <Avatar className="h-[34px] md:h-10 w-[34px] md:w-10 mt-1">
        <AvatarImage src={comment.imageurl} />
        <AvatarFallback>
          {generateNameInitials(comment.username)}
        </AvatarFallback>
      </Avatar>
      
      <div className="w-full">
        <div className="flex items-center gap-[10px]">
          <p className="text-base font-semibold">
            {comment.username}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            {getTimeIndicator(comment.created_at)}
          </p>
        </div>
        {isEditing ? (
          <div className="mt-2">
            <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="min-h-[80px]" maxLength={192} />

            <div className="flex gap-2 mt-2">
              <Button 
                size="sm"
                onClick={handleEdit}
                disabled={updateMutation.isPending || deleteMutation.isPending}
              >
                <Check className="h-4 w-4 mr-[6px]" />
                Save
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                className="border-[#c5cad3] dark:border-[#36383f]"
              >
                <X className="h-4 w-4 mr-[6px]" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="md:mt-[2px] break-words whitespace-pre-line overflow-wrap-anywhere text-sm font-normal">
            {comment.comment}
          </p>
        )}
      </div>

      {(permission && !isEditing) ? (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsEditing(true)}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => deleteMutation.mutate(comment.id)}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}