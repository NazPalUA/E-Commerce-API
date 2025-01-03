import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';
import { Input } from './input';

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  action?: React.ReactNode;
}

export function InputGroup({
  label,
  className,
  id,
  action,
  ...props
}: InputGroupProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <div className="flex items-center">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>

      <Input id={id} {...props} />
    </div>
  );
}
