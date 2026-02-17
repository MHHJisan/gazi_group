"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Try to get current user first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUsers([user]);
      } else {
        // Try to list users (this might fail due to permissions)
        try {
          const { data, error } = await supabase.auth.admin.listUsers();
          if (error) {
            setError("Cannot list users (permission issue), but current user check worked");
          } else {
            setUsers(data.users || []);
          }
        } catch (listError) {
          setError("No authenticated user found and cannot list users");
        }
      }
    } catch (error) {
      setError(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Existing Users</CardTitle>
          <CardDescription>
            Check what users exist in Supabase Auth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkUsers}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Checking..." : "Check Users"}
          </Button>
          
          {error && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              {error}
            </div>
          )}
          
          {users.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Found Users:</h3>
              {users.map((user, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
