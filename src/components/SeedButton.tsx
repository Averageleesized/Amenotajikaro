import { useState } from 'react';
import { Button } from './ui/button';
import { Database, Trash2, HelpCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';

const ADMIN_PASSWORD = 'andcvadmin';

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setShowPasswordDialog(false);
      setPasswordInput('');
      toast.success('Dev tools unlocked');
    } else {
      toast.error('Incorrect password');
      setPasswordInput('');
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/seed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(`Database seeded! Created ${data.performancesCreated} tournament performances`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to seed database');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Error seeding database');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all tournament performances? This cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/clear-performances`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(`Cleared ${data.deletedCount} tournament performances`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Failed to clear database');
      }
    } catch (error) {
      console.error('Error clearing database:', error);
      toast.error('Error clearing database');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      {!isUnlocked ? (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            onClick={() => setShowPasswordDialog(true)}
            variant="outline"
            size="sm"
            className="bg-card border-border shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] w-10 h-10 p-0"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
          <Button
            onClick={handleSeed}
            disabled={isSeeding || isClearing}
            variant="outline"
            size="sm"
            className="bg-card border-border shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)]"
          >
            <Database className="w-4 h-4 mr-2" />
            {isSeeding ? 'Seeding...' : 'Seed Test Data'}
          </Button>
          <Button
            onClick={handleClear}
            disabled={isSeeding || isClearing}
            variant="outline"
            size="sm"
            className="bg-card border-border shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isClearing ? 'Clearing...' : 'Clear Data'}
          </Button>
        </div>
      )}

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Dev Tools Access</DialogTitle>
            <DialogDescription>
              Enter the password to access development tools
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="bg-input-background border-border"
              autoFocus
            />
            <Button type="submit" className="bg-primary text-primary-foreground">
              Unlock
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
