import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import AppSidebar from '@/components/app-sidebar';
import MobileTopbar from '@/components/mobile-topbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { analysisId, repo } = router.query;
  const repoParam = typeof repo === 'string' ? repo : '';
  const pathMatch = router.asPath.match(/\/dashboard\/([^/]+)\/([^/?#]+)/);
  const resolvedAnalysisId = typeof analysisId === 'string' ? analysisId : pathMatch?.[1];
  const resolvedRepo = repoParam || pathMatch?.[2] || '';
  const dashboardHref = resolvedAnalysisId && resolvedRepo ? `/dashboard/${resolvedAnalysisId}/${resolvedRepo}` : undefined;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <main className="min-w-0 flex-1">
        <MobileTopbar dashboardHref={dashboardHref} />
        {children}
      </main>
    </div>
  );
}
