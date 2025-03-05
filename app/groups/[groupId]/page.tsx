"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  created_at: string;
  user_email: string;
}

interface GroupDetails {
  id: string;
  name: string;
}

export default function GroupPage({ params }: { params: { groupId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      fetchGroupDetails();
      fetchExpenses();
    };

    getUser();
  }, [params.groupId, router]);

  const fetchGroupDetails = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", params.groupId)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to fetch group details",
        variant: "destructive",
      });
      return;
    }

    setGroup(data);
  };

  const fetchExpenses = async () => {
    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`/api/expenses/${params.groupId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setExpenses(data);

      console.log(response);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch expenses",
        variant: "destructive",
      });
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim()) return;

    setLoading(true);

    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`/api/expenses/${params.groupId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        description,
        amount: parseFloat(amount),
      }),
    });

    if (response.ok) {
      setDescription("");
      setAmount("");
      fetchExpenses();
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  if (!group) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-2xl font-bold mb-6">{group.name}</h1>

        <form onSubmit={addExpense} className="flex gap-2 mb-6">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            Add Expense
          </Button>
        </form>

        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{expense.description}</h3>
                  <p className="text-sm text-gray-500">
                    Added by {expense.user_email}
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  ${expense.amount.toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
