import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Camera, Save, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    updateUser({ name: name.trim(), email: email.trim() });
    toast.success('Profile updated');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword.length < 4) {
      toast.error('Enter your current password');
      return;
    }
    if (newPassword.length < 4) {
      toast.error('New password must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="page-header">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      {/* Avatar & Info */}
      <div className="table-container p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-2xl font-bold text-accent">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-accent-foreground" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-medium capitalize bg-accent/10 text-accent px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="table-container p-6">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required minLength={4} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={4} />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={4} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline">Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
