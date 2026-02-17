"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setResult("Testing connection...");

    try {
      setResult("✅ Supabase client created successfully");

      // Test auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setResult(`❌ Auth error: ${error.message}`);
      } else {
        setResult(`✅ Auth successful! User: ${data.user?.email}`);
      }
    } catch (error) {
      setResult(`❌ Connection error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Supabase Auth</CardTitle>
          <CardDescription>
            Test Supabase connection and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />
          </div>

          <Button
            onClick={testSupabaseConnection}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md text-sm whitespace-pre-wrap ${
                result.includes("✅")
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
