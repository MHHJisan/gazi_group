"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Key, Mail } from "lucide-react";

interface UserActionsMenuProps {
  userId: string;
  userName: string;
  onPasswordChanged?: () => void;
  onPasswordReset?: () => void;
}

export function UserActionsMenu({
  userId,
  userName,
  onPasswordChanged,
  onPasswordReset,
}: UserActionsMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePasswordChange = () => {
    console.log("Change password clicked");
    setDropdownOpen(false);
    if (onPasswordChanged) {
      setTimeout(() => {
        console.log("Calling onPasswordChanged callback");
        onPasswordChanged();
      }, 100);
    }
  };

  const handlePasswordReset = () => {
    console.log("Password reset clicked");
    setDropdownOpen(false);
    if (onPasswordReset) {
      setTimeout(() => {
        console.log("Calling onPasswordReset callback");
        onPasswordReset();
      }, 100);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <MoreHorizontal className="h-3 w-3" />
      </Button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[160px]">
          <div
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center"
            onClick={handlePasswordChange}
          >
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </div>
          <div
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center"
            onClick={handlePasswordReset}
          >
            <Mail className="mr-2 h-4 w-4" />
            Forgot Password
          </div>
        </div>
      )}
    </div>
  );
}
