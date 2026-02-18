"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile Settings State
  const [profileSettings, setProfileSettings] = useState({
    fullName: "",
    email: "",
    phone: "",
    phone_code: "+1",
    department: "",
    role: "",
  });

  // Original profile data for comparison
  const [originalProfileSettings, setOriginalProfileSettings] = useState({
    fullName: "",
    email: "",
    phone: "",
    phone_code: "+1",
    department: "",
    role: "",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Data Settings State
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    dataRetention: "12",
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    compactMode: false,
    showAnimations: true,
  });

  // Regional Settings State
  const [regionalSettings, setRegionalSettings] = useState({
    language: "en",
    timezone: "UTC-06:00",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUserData(data.user);
            const profileData = {
              fullName: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              phone_code: data.user.phone_code || "+1",
              department: data.user.department || "",
              role: data.user.role || "",
            };
            setProfileSettings(profileData);
            setOriginalProfileSettings(profileData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Apply theme changes
  useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = window.document.documentElement;

      // Remove all theme classes
      root.classList.remove("light", "dark");

      // Apply the new theme
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }

      // Save to localStorage
      localStorage.setItem("theme", theme);
    };

    // Apply theme when appearance settings change
    if (appearanceSettings.theme) {
      applyTheme(appearanceSettings.theme);
    }
  }, [appearanceSettings.theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (appearanceSettings.theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [appearanceSettings.theme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setAppearanceSettings((prev) => ({
      ...prev,
      theme: savedTheme,
    }));
  }, []);

  // Helper function to get country flag
  const getCountryFlag = (phoneCode: string) => {
    const flags: { [key: string]: string } = {
      "+1": "🇺🇸",
      "+44": "🇬🇧",
      "+91": "🇮🇳",
      "+61": "🇦🇺",
      "+49": "🇩🇪",
      "+86": "🇨🇳",
      "+880": "🇧🇩",
    };
    return flags[phoneCode] || "🌍";
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setProfileSettings(originalProfileSettings);
    setIsEditingProfile(false);
  };

  const showMessage = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccessMessage(message);
      setErrorMessage("");
    } else {
      setErrorMessage(message);
      setSuccessMessage("");
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: profileSettings.fullName,
          phone: profileSettings.phone,
          phone_code: profileSettings.phone_code,
          department: profileSettings.department,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOriginalProfileSettings(profileSettings);
          setIsEditingProfile(false);
          showMessage(
            data.message || "Profile updated successfully!",
            "success",
          );
        } else {
          showMessage(data.error || "Failed to update profile", "error");
        }
      } else {
        showMessage("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Profile save error:", error);
      showMessage("Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("Notification preferences saved successfully!", "success");
    } catch (error) {
      showMessage("Failed to save notification settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    if (securitySettings.newPassword.length < 8) {
      showMessage("Password must be at least 8 characters long", "error");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("Password updated successfully!", "success");
      setSecuritySettings({
        ...securitySettings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showMessage("Failed to update password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("Data settings saved successfully!", "success");
    } catch (error) {
      showMessage("Failed to save data settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("Appearance settings saved successfully!", "success");
    } catch (error) {
      showMessage("Failed to save appearance settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionalSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("Regional settings saved successfully!", "success");
    } catch (error) {
      showMessage("Failed to save regional settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showMessage("Data export completed successfully!", "success");
    } catch (error) {
      showMessage("Failed to export data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("Cache cleared successfully!", "success");
    } catch (error) {
      showMessage("Failed to clear cache", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorEnabled: !securitySettings.twoFactorEnabled,
    });
    showMessage(
      securitySettings.twoFactorEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled",
      "success",
    );
  };

  const CustomSwitch = ({
    checked,
    onCheckedChange,
    label,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">Toggle this setting</p>
      </div>
      <button
        type="button"
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application settings and preferences
            </p>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
              <CheckCircle className="h-4 w-4" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 p-1 bg-muted rounded-lg">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security", icon: Shield },
              { id: "data", label: "Data", icon: Database },
              { id: "appearance", label: "Appearance", icon: Palette },
              { id: "regional", label: "Regional", icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  {isEditingProfile
                    ? "Edit your personal information and account details"
                    : "View your personal information and account details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditingProfile ? (
                  // View Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <p className="p-2 bg-muted rounded-md">
                          {profileSettings.fullName || "Not set"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <p className="p-2 bg-muted rounded-md">
                          {profileSettings.email || "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Phone
                        </Label>
                        <p className="p-2 bg-gray-50 rounded-md">
                          {profileSettings.phone_code && profileSettings.phone
                            ? `${getCountryFlag(profileSettings.phone_code)} ${profileSettings.phone_code} ${profileSettings.phone}`
                            : "Not set"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Department
                        </Label>
                        <p className="p-2 bg-gray-50 rounded-md">
                          {profileSettings.department || "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Role
                      </Label>
                      <p className="p-2 bg-gray-50 rounded-md capitalize">
                        {profileSettings.role || "Not set"}
                      </p>
                    </div>
                    <Button onClick={handleEditProfile} className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profileSettings.fullName}
                          onChange={(e) =>
                            setProfileSettings({
                              ...profileSettings,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileSettings.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-sm text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone_code">Country Code</Label>
                        <Select
                          value={profileSettings.phone_code}
                          onValueChange={(value) =>
                            setProfileSettings({
                              ...profileSettings,
                              phone_code: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">
                              🇺🇸 +1 (US/Canada)
                            </SelectItem>
                            <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91 (India)</SelectItem>
                            <SelectItem value="+61">
                              🇦🇺 +61 (Australia)
                            </SelectItem>
                            <SelectItem value="+49">
                              🇩🇪 +49 (Germany)
                            </SelectItem>
                            <SelectItem value="+86">🇨🇳 +86 (China)</SelectItem>
                            <SelectItem value="+880">
                              🇧🇩 +880 (Bangladesh)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileSettings.phone}
                          onChange={(e) =>
                            setProfileSettings({
                              ...profileSettings,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileSettings.department}
                        onChange={(e) =>
                          setProfileSettings({
                            ...profileSettings,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profileSettings.role}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-sm text-gray-500">
                        Role cannot be changed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleProfileSave}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CustomSwitch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                  label="Email Notifications"
                />
                <CustomSwitch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked,
                    })
                  }
                  label="Push Notifications"
                />
                <CustomSwitch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked,
                    })
                  }
                  label="SMS Notifications"
                />
                <CustomSwitch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: checked,
                    })
                  }
                  label="Weekly Reports"
                />
                <Button onClick={handleNotificationSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Notifications"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your security preferences and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={securitySettings.currentPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securitySettings.newPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securitySettings.confirmPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggle2FA}
                    className={`relative inline-flex h-8 w-24 items-center justify-center rounded transition-colors ${
                      securitySettings.twoFactorEnabled
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    <span className="text-white text-sm font-medium text-center">
                      {securitySettings.twoFactorEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </button>
                </div>
                <Button onClick={handlePasswordUpdate} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Tab */}
          {activeTab === "data" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data & Storage
                </CardTitle>
                <CardDescription>
                  Manage your data storage and backup settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CustomSwitch
                  checked={dataSettings.autoBackup}
                  onCheckedChange={(checked) =>
                    setDataSettings({ ...dataSettings, autoBackup: checked })
                  }
                  label="Auto Backup"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Retention</p>
                    <p className="text-sm text-muted-foreground">
                      Keep data for selected period
                    </p>
                  </div>
                  <Select
                    value={dataSettings.dataRetention}
                    onValueChange={(value) =>
                      setDataSettings({ ...dataSettings, dataRetention: value })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">
                      Download all your data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    {isLoading ? "Exporting..." : "Export"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Clear Cache</p>
                    <p className="text-sm text-muted-foreground">
                      Clear temporary files
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleClearCache}
                    disabled={isLoading}
                  >
                    {isLoading ? "Clearing..." : "Clear"}
                  </Button>
                </div>
                <Button onClick={handleDataSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Data Settings"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme
                    </p>
                  </div>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        theme: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CustomSwitch
                  checked={appearanceSettings.compactMode}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      compactMode: checked,
                    })
                  }
                  label="Compact Mode"
                />
                <CustomSwitch
                  checked={appearanceSettings.showAnimations}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      showAnimations: checked,
                    })
                  }
                  label="Show Animations"
                />
                <Button onClick={handleAppearanceSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Appearance"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Regional Tab */}
          {activeTab === "regional" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Configure language and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={regionalSettings.language}
                      onValueChange={(value) =>
                        setRegionalSettings({
                          ...regionalSettings,
                          language: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={regionalSettings.timezone}
                      onValueChange={(value) =>
                        setRegionalSettings({
                          ...regionalSettings,
                          timezone: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-06:00">
                          UTC-06:00 Central Time
                        </SelectItem>
                        <SelectItem value="UTC-05:00">
                          UTC-05:00 Eastern Time
                        </SelectItem>
                        <SelectItem value="UTC-08:00">
                          UTC-08:00 Pacific Time
                        </SelectItem>
                        <SelectItem value="UTC+00:00">UTC+00:00 GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={regionalSettings.currency}
                      onValueChange={(value) =>
                        setRegionalSettings({
                          ...regionalSettings,
                          currency: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={regionalSettings.dateFormat}
                      onValueChange={(value) =>
                        setRegionalSettings({
                          ...regionalSettings,
                          dateFormat: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleRegionalSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Regional Settings"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
