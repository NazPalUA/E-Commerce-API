import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
          {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
