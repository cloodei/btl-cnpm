"use client";
import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { FloatTextarea } from "../ui/float-input";
import { Loader2 } from "lucide-react";
import Comment from "./comment";

export default function CommentList({ deckId, userId }) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    return  () => queryClient.resetQueries({ queryKey: ['comments', deckId] });
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['comments', deckId],
    queryFn: ({ pageParam = 1 }) => getComments(deckId, pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
    staleTime: 30000
  });

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', deckId] });
      setNewComment("");
    }
  });

  const allComments = [];
  for(const page of data?.pages || []) {
    allComments.push(...page.comments);
  }
  
  if(isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mt-8 border rounded-lg">
      <div className="p-4 border-b">
        <FloatTextarea
          label="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="md:pb-6 pb-4 mb-4"
          maxLength={192}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => addMutation.mutate({ deckId, userId, comment: newComment })}
          disabled={!newComment.trim() || addMutation.isPending}
        >
          {addMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            'Post Comment'
          )}
        </Button>
      </div>
      
      {!allComments.length && !isLoading ? (
        <div className="pt-4 pb-3 text-center text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <>
          <div className="divide-y">
            {allComments.map((comment) => (
              <Comment key={comment.id} comment={comment} permission={userId === comment.commenter_id} />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="p-4 flex justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  'Load More Comments'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}