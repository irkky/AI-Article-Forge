import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import emptyStateImage from "@assets/generated_images/Empty_state_illustration_08d3416c.png";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 opacity-50">
        {Icon ? (
          <Icon className="w-full h-full text-muted-foreground" />
        ) : (
          <img src={emptyStateImage} alt="Empty state" className="w-full h-full" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} data-testid="button-empty-action">
          {action.label}
        </Button>
      )}
    </div>
  );
}
