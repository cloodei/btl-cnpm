import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { BookX } from 'lucide-react';

export default function DeckNotFound() {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <BookX className="h-24 w-24 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-rose-700 dark:text-rose-500">Deck Not Found</h2>
          <p className="text-muted-foreground">
            The deck you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary-foreground rounded-lg hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            Return Home
          </Link>
        </div>
      </Card>
    </div>
  );
}