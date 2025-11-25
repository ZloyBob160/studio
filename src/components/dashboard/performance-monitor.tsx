'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Lightbulb, LoaderCircle } from 'lucide-react';
import { getImprovementSuggestionsAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  suggestions: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <Lightbulb />
      )}
      Generate Suggestions
    </Button>
  );
}

export function PerformanceMonitor() {
  const [state, formAction] = useActionState(
    getImprovementSuggestionsAction,
    initialState
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">Performance Improvement</CardTitle>
          <CardDescription>
            Input current performance data to get AI-powered suggestions for
            process improvements and workload reduction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="performance-data">
              Current Performance Data
            </Label>
            <Textarea
              id="performance-data"
              name="performanceData"
              placeholder="e.g., 'Business analysts spend 10 hours per week manually formatting requirement documents. The average time to get stakeholder sign-off is 5 days.'"
              rows={4}
              required
            />
          </div>
          {state?.suggestions && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><Lightbulb className='text-primary'/> AI Suggestions</h4>
                <div className="text-sm text-foreground whitespace-pre-wrap">{state.suggestions}</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
