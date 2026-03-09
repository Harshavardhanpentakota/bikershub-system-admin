import { useState } from "react";
import { User, Lock, Store, CreditCard, Truck } from "lucide-react";
import { PageHeader } from "@/components/admin/SharedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <PageHeader title="Settings" description="Manage your admin preferences" />

      <Tabs defaultValue="profile">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="profile" className="gap-2"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="password" className="gap-2"><Lock className="w-3.5 h-3.5" />Password</TabsTrigger>
          <TabsTrigger value="store" className="gap-2"><Store className="w-3.5 h-3.5" />Store</TabsTrigger>
          <TabsTrigger value="payment" className="gap-2"><CreditCard className="w-3.5 h-3.5" />Payment</TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2"><Truck className="w-3.5 h-3.5" />Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="font-semibold">Admin Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="admin@bikershub.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+1 234 567 890" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value="Administrator" disabled />
              </div>
            </div>
            <Button onClick={() => toast.success("Profile updated")}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="font-semibold">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" />
              </div>
            </div>
            <Button onClick={() => toast.success("Password updated")}>Update Password</Button>
          </div>
        </TabsContent>

        <TabsContent value="store" className="mt-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="font-semibold">Store Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input defaultValue="BikersHub" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input defaultValue="USD" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Store Description</Label>
                <Input defaultValue="Premium motorcycle gear & accessories" />
              </div>
            </div>
            <Button onClick={() => toast.success("Store settings updated")}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="font-semibold">Payment Settings</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Payment Gateway</Label>
                <Input defaultValue="Stripe" />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" defaultValue="sk_live_..." />
              </div>
            </div>
            <Button onClick={() => toast.success("Payment settings updated")}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <h3 className="font-semibold">Shipping Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Shipping Rate</Label>
                <Input type="number" defaultValue="5.99" />
              </div>
              <div className="space-y-2">
                <Label>Free Shipping Threshold</Label>
                <Input type="number" defaultValue="50" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Shipping Zones</Label>
                <Input defaultValue="US, Canada, Europe" />
              </div>
            </div>
            <Button onClick={() => toast.success("Shipping settings updated")}>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
