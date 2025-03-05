"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface Group {
  id: string;
  name: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
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
      setUser(user);
      fetchGroups();
    };

    getUser();
  }, [router]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive",
      });
      return;
    }

    setGroups(data || []);
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`, // Include token
      },
      body: JSON.stringify({ name: newGroupName }),
    });

    if (response.ok) {
      setNewGroupName("");
      fetchGroups();
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Groups</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <form onSubmit={createGroup} className="flex gap-2 mb-6">
          <Input
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/groups/${group.id}`)}
            >
              <h2 className="text-xl font-semibold">{group.name}</h2>
              <p className="text-sm text-gray-500">
                Created {new Date(group.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
