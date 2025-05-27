import { IconDashboard } from "@tabler/icons-react";
import {
  ArrowUpDown,
  BatteryCharging,
  GitPullRequest,
  Layers,
  PiggyBank,
  RadioTower,
  SquareKanban,
  WandSparkles,
} from "lucide-react";

interface Reason {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature43Props {
  heading?: string;
  reasons?: Reason[];
}

const Feature43 = ({
  heading = "Our Features",
  reasons = [
    {
      title: "Transactions",
      description:
        "Easily track and categorize your transactions to gain insights into your spending habits.",
      icon: <ArrowUpDown className="size-6" />,
    },
    {
      title: "Budgeting",
      description: "Set and manage your budgets effortlessly to stay on track.",
      icon: <PiggyBank className="size-6" />,
    },
    {
      title: "Monitoring",
      description:
        "Monitor your financial health with real-time updates and insights.",
      icon: <IconDashboard className="size-6" />,
    },
  ],
}: Feature43Props) => {
  return (
    <section id="features" className="py-32">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            {heading}
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {reason.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature43 };
