"use client";

import { useState } from "react";
import { createTestUser } from "@/lib/admin-actions";
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

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateUser = async () => {
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await createTestUser(email, password, name);
      setMessage(result.message || "User creation completed");

      if (result.success) {
        // Clear form on success
        setEmail("");
        setPassword("");
        setName("");
      }
    } catch (error) {
      setMessage("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Test User</CardTitle>
          <CardDescription>
            Create a test user for authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test User"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <Button
            onClick={handleCreateUser}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
