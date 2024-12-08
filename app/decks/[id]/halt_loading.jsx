import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 pb-8 space-y-8">
      <div className="bg-muted rounded-lg animate-pulse" />
      <Skeleton className="w-full h-12" />
      <Card className="p-6">
        <Skeleton className="md:h-60 h-48 w-full mb-2" />
      </Card>
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-10 w-28 md:w-32 rounded-lg" />
        <Skeleton className="h-10 w-28 md:w-32 rounded-lg" />
      </div>
    </div>
  );
}