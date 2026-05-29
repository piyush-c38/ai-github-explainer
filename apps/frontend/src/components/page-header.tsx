import { cn } from '@/lib/utils';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div>
        {eyebrow && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8 md:py-10">{children}</div>;
}
