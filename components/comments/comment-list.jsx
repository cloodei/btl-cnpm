"use client";
import { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import { FloatTextarea } from "../ui/float-input";
import { Loader2 } from "lucide-react";
import Comment from "./comment";
import { useRouter } from "next/navigation";

export default function CommentList({ deckId, userId }) {
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    return  () => queryClient.resetQueries({ queryKey: ['comments', deckId] });
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ['comments', deckId],
    queryFn: ({ pageParam = 1 }) => getComments(deckId, pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
    staleTime: 60000
  });

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', deckId] });
      setNewComment("");
    }
  });

  if(error) {
    return (
      <div className="mt-8 pb-3 border rounded-lg flex flex-col items-center gap-[6px]">
        <div className="pt-3 text-base md:text-xl font-medium tracking-tight text-rose-500">
          {error.message || "An error occurred"}
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  if(isLoading) {
    return (
      <div className="flex justify-center pt-11 pb-2">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const allComments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="mt-8 border rounded-lg shadow-[0px_1px_6px_rgba(0,0,0,0.1)]">
      <div className="p-4 sm:p-[22px]">
        <FloatTextarea
          label="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="md:pb-6 pb-4 mb-4 border-gray-300 dark:border-[#232429]"
          maxLength={192}
        />
        <Button
          variant="outline"
          className="w-full border-gray-300 dark:border-[#232429] max-sm:text-sm"
          onClick={() => addMutation.mutate({ deckId, userId, comment: newComment.trim() })}
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
      
      {allComments.length ? (
        <>
          {allComments.map((comment, i) => <Comment key={i} comment={comment} permission={userId === comment.commenter_id} />)}
          {hasNextPage ? (
            <div className="pb-[14px] flex justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading comments...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          ): null}
        </>
      ) : (
        <div className="pt-4 pb-3 text-center text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}