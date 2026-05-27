import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketSquareIcon,
  ShareIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

export default function Sidebar() {
  const router = useRouter();
  const { analysisId, repo } = router.query;
  const repoParam = typeof repo === 'string' ? repo : '';

  const navigation = [
    { name: 'Overview', href: `/dashboard/${analysisId}/${repoParam}` },
    { name: 'File Explorer', href: `/dashboard/${analysisId}/${repoParam}/files` },
    { name: 'Dependencies', href: `/dashboard/${analysisId}/${repoParam}/dependencies` },
    { name: 'Code Flow', href: `/dashboard/${analysisId}/${repoParam}/flow` },
    { name: 'Chat', href: `/dashboard/${analysisId}/${repoParam}/chat` },
  ];

  const icons: { [key: string]: React.ElementType } = {
    Overview: HomeIcon,
    'File Explorer': FolderIcon,
    Dependencies: ShareIcon,
    'Code Flow': CodeBracketSquareIcon,
    Chat: ChatBubbleLeftRightIcon,
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-1 border-r border-outline p-4">
      <div className="flex items-center justify-center h-16 mb-4">
        <h1 className="text-2xl font-bold text-primary">AI Explainer</h1>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = icons[item.name];
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                router.asPath === item.href
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-2'
              )}
            >
              <Icon className="h-6 w-6 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
