import { useRouter } from 'next/router';
import useSWR from 'swr';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { fetcher } from '@/lib/api';

function OverviewCard({ title, value }: { title: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-surface-1 p-6 rounded-lg border border-outline"
    >
      <h3 className="text-lg font-medium text-on-surface-variant">{title}</h3>
      <p className="text-3xl font-bold text-primary mt-2">{value}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { analysisId } = router.query;

  const { data, error } = useSWR(analysisId ? `/api/analysis/${analysisId}` : null, fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <DashboardLayout><div>Failed to load analysis.</div></DashboardLayout>;
  if (!data) return <DashboardLayout><div>Loading analysis...</div></DashboardLayout>;
  if (data.status !== 'completed') {
    return <DashboardLayout><div>Analysis in progress: {data.status}</div></DashboardLayout>;
  }
  if (!data.repoUrl || !data.files || !data.dependencies) {
    return <DashboardLayout><div>Analysis data is incomplete.</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-primary mb-2">Repository Overview</h1>
        <p className="text-on-surface-variant mb-8">{data.repoUrl}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <OverviewCard title="Files Analyzed" value={data.files.length} />
          <OverviewCard title="Parsed Files" value={data.parsedData?.length || 0} />
          <OverviewCard title="Dependencies" value={Object.keys(data.dependencies).length} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
