import SettingsManagerClient from './SettingsManagerClient';

export const metadata = {
  title: 'System Settings — TARZER Admin',
  description: 'Manage Supabase configuration, affiliate tags, and system parameters.'
};

export default function AdminSettingsPage() {
  return <SettingsManagerClient />;
}
