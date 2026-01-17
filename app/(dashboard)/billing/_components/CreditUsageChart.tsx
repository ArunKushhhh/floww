"use client";

import { getCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStacked } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof getCreditsUsageInPeriod>>;
const chartConfig = {
  success: {
    label: "Successfull Phases Credits",
    color: "var(--chart-2)",
  },
  failed: {
    label: "Failed Phases Credits",
    color: "var(--chart-5)",
  },
};

export function CreditUsageChart({ data, title, description }: { data: ChartData, title: string, description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-2xl flex gap-2 items-center">
          <ChartColumnStacked className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[250px] w-full" config={chartConfig}>
          <BarChart
            data={data}
            height={250}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey={"success"}
              fill="var(--color-success)"
              fillOpacity={0.8}
              stroke="var(--color-success)"
              stackId={"a"}
            />
            <Bar
              dataKey={"failed"}
              fill="var(--color-failed)"
              fillOpacity={0.8}
              stroke="var(--color-failed)"
              stackId={"b"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
