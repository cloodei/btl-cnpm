import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment, deleteComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTimeIndicator } from "@/lib/utils";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Comment({ comment, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.comment);
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.deck_id] });
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', comment.deck_id] })
  });

  const permission = (currentUserId === comment.commenter_id);

  return (
    <div className="flex gap-4 p-4 border-b">
      <Avatar className="h-10 w-10">
        <AvatarImage src={comment.imageurl} />
        <AvatarFallback>{comment.username[0]}</AvatarFallback>
      </Avatar>
      
      <div className="w-full">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.username}</span>
          <span className="text-sm text-muted-foreground">
            {getTimeIndicator(comment.created_at)}
          </span>
        </div>
        {isEditing ? (
          <div className="mt-2">
            <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="min-h-[80px]" maxLength={192} />
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm"
                onClick={() => updateMutation.mutate({ commentId: comment.id, comment: editedText })}
                disabled={updateMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 break-words whitespace-pre-line overflow-wrap-anywhere">
            {comment.comment}
          </p>
        )}
      </div>

      {(permission && !isEditing) && (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => deleteMutation.mutate(comment.id)} disabled={deleteMutation.isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}