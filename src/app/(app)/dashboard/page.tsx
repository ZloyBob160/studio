import { FileText, Hourglass, TrendingDown } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { PerformanceMonitor } from '@/components/dashboard/performance-monitor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your AI Business Analyst assistant.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Avg. Requirement Time"
          value="3.2 min"
          icon={<Hourglass className="text-accent" />}
          description="Average time from dialog to document."
        />
        <MetricCard
          title="Workload Reduction"
          value="24%"
          icon={<TrendingDown className="text-accent" />}
          description="Automated vs. manual task ratio."
        />
        <MetricCard
          title="Documents Generated"
          value="152"
          icon={<FileText className="text-accent" />}
          description="Total artifacts created this month."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <PerformanceMonitor />
      </div>

      <Card>
        <CardHeader>
            <CardTitle className='font-headline'>How to use AnalystAI</CardTitle>
            <CardDescription>Follow these steps to get started with your AI assistant.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-4">
            <div>
                <h3 className="font-semibold text-primary">1. Start a Conversation</h3>
                <p className="text-muted-foreground">Navigate to the <span className='font-semibold text-foreground'>Chat Analyst</span> tab. The AI will guide you through a series of questions to gather all necessary details about your business needs.</p>
            </div>
            <div>
                <h3 className="font-semibold text-primary">2. Generate Documents</h3>
                <p className="text-muted-foreground">Once the conversation is complete, click the "Finalize Requirements" button. The AI will process the entire conversation and generate a comprehensive set of documents.</p>
            </div>
            <div>
                <h3 className="font-semibold text-primary">3. Review and Export</h3>
                <p className="text-muted-foreground">Review the generated Business Requirements Document, Use Cases, User Stories, and more. You can then copy the content or use the Confluence integration link.</p>
            </div>
             <div>
                <h3 className="font-semibold text-primary">4. Monitor & Improve</h3>
                <p className="text-muted-foreground">Use the dashboard to monitor performance and ask the AI for suggestions on how to further improve your business processes based on the collected data.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
