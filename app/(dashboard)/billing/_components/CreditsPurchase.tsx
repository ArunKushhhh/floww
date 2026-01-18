"use client";

import { purchaseCredits } from "@/actions/billing/purchaseCredits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditsPack, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCard } from "lucide-react";
import { useState } from "react";

export function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);

  const mutation = useMutation({
    mutationFn: purchaseCredits,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold items-center gap-2 flex">
          <CoinsIcon className="size-6 stroke-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPack.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex justify-between items-center w-full cursor-pointer">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => mutation.mutate(selectedPack)}
          disabled={mutation.isPending}
          className="flex items-center gap-2 w-full"
        >
          <CreditCard />
          Purchase Credits
        </Button>
      </CardFooter>
    </Card>
  );
}
