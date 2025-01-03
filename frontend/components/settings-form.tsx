import { Button } from '@/components/ui/button';
import { AuthCard } from './ui/auth-card';
import { InputGroup } from './ui/input-group';

export function SettingsForm() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="flex flex-col gap-6">
        <AuthCard
          title="Update Email"
          description="Change your email address. You'll need to verify your new email."
        >
          <form>
            <div className="flex flex-col gap-6">
              <InputGroup
                label="Current Email"
                id="currentEmail"
                type="email"
                value="current@email.com"
                disabled
              />
              <InputGroup
                label="New Email"
                id="newEmail"
                type="email"
                placeholder="Enter new email"
                required
              />
              <Button type="submit" className="w-full">
                Update Email
              </Button>
            </div>
          </form>
        </AuthCard>

        <AuthCard
          title="Change Password"
          description="Update your password to keep your account secure."
        >
          <form>
            <div className="flex flex-col gap-6">
              <InputGroup
                label="Current Password"
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                required
              />
              <InputGroup
                label="New Password"
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                required
              />
              <InputGroup
                label="Confirm New Password"
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                required
              />
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
