import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Shield,
  Settings2,
  Save,
  Camera,
  BadgeCheck,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useCandidateProfile, useUpdateCandidate } from '../../hooks/useCandidates';
import { useLogout } from '../../hooks/useAuth';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { data: candidate, isLoading } = useCandidateProfile();
  const updateCandidate = useUpdateCandidate();
  const logout = useLogout();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
  });

  const [preferences, setPreferences] = useState({
    applicationUpdates: true,
    examReminders: true,
    newsletter: false,
    twoFactorEnabled: true,
    language: 'English (United States)',
  });

  useEffect(() => {
    if (candidate) {
      const user = (candidate as any).user || {};
      const rawDateOfBirth = candidate.dateOfBirth || '';
      const formattedDate = rawDateOfBirth ? rawDateOfBirth.split('T')[0] : '';
      setFormData({
        firstName: candidate.firstName || user.firstName || '',
        lastName: candidate.lastName || user.lastName || '',
        email: candidate.email || user.email || '',
        phone: candidate.phone || user.phone || '',
        dateOfBirth: formattedDate,
        address: candidate.address || '',
        city: candidate.city || '',
        country: candidate.country || '',
      });
    }
  }, [candidate]);

  const handleSave = () => {
    updateCandidate.mutate({
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      city: formData.city,
      country: formData.country,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-on-surface-variant">Loading profile...</div>
      </div>
    );
  }

  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Candidate';
  const candidateId = (candidate as any)?.candidateNumber || 'N/A';
  const photoUrl = (candidate as any)?.profilePhoto || candidate?.photoUrl || null;

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />
      <main className="ml-64 pt-24 pb-12 px-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-2">
              Profile Settings
            </h1>
            <p className="text-on-surface-variant font-body">
              Manage your academic identity, security preferences, and portal notifications.
            </p>
          </header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
        <div className="lg:col-span-2 space-y-8">
          <motion.section
            variants={itemVariants}
            className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_8px_24px_rgba(25,28,30,0.04)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <User className="text-primary" size={24} />
              <h2 className="font-headline text-xl font-bold text-primary">
                Personal Information
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 group">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={fullName}
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-low shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface-container-low shadow-sm">
                      <span className="text-4xl font-bold text-primary">
                        {formData.firstName?.[0] || formData.email?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-primary text-surface-container-lowest p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                    <Camera size={16} />
                  </button>
                </div>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold">
                  Candidate Avatar
                </span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="bg-surface-container-high p-3 rounded-t-lg border-b-2 border-primary-container text-primary font-medium">
                    {fullName}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                    Candidate ID
                  </label>
                  <div className="bg-surface-container-high p-3 rounded-t-lg border-b-2 border-outline-variant text-on-surface-variant font-medium">
                    {candidateId}
                  </div>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="bg-surface-container-high p-3 rounded-t-lg border-b-2 border-transparent focus:border-primary transition-colors text-primary font-medium w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_8px_24px_rgba(25,28,30,0.04)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <Mail className="text-primary" size={24} />
              <h2 className="font-headline text-xl font-bold text-primary">Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  Primary Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-surface-container-high p-3 pr-12 rounded-t-lg border-b-2 border-transparent focus:border-primary transition-colors text-primary font-medium w-full focus:outline-none"
                  />
                  <BadgeCheck size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="bg-surface-container-high p-3 rounded-t-lg border-b-2 border-transparent focus:border-primary transition-colors text-primary font-medium w-full focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  Residential Address
                </label>
                <textarea
                  className="bg-surface-container-high p-3 rounded-t-lg border-b-2 border-transparent focus:border-primary transition-colors text-primary font-medium w-full resize-none focus:outline-none"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your residential address"
                />
              </div>
            </div>
          </motion.section>
        </div>

        <aside className="space-y-8">
          <motion.section
            variants={itemVariants}
            className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(25,28,30,0.04)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-primary" size={24} />
              <h2 className="font-headline text-lg font-bold text-primary">Account Security</h2>
            </div>

            <div className="space-y-6">
              <button className="w-full flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <div className="text-left">
                  <div className="text-sm font-bold text-primary">Change Password</div>
                  <div className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                    Update your password
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-on-surface-variant group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low">
                <div>
                  <div className="text-sm font-bold text-primary">2FA Authentication</div>
                  <div className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                    SMS & Authenticator App
                  </div>
                </div>
                <Toggle
                  checked={preferences.twoFactorEnabled}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, twoFactorEnabled: checked })
                  }
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(25,28,30,0.04)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings2 className="text-primary" size={24} />
              <h2 className="font-headline text-lg font-bold text-primary">Preferences</h2>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                  Portal Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="bg-surface-container-low p-3 rounded-lg border-none text-primary font-medium w-full focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option>English (United States)</option>
                  <option>English (United Kingdom)</option>
                  <option>German (Deutsch)</option>
                  <option>French (Français)</option>
                </select>
              </div>

              <div className="space-y-4 pt-2">
                <PreferenceItem
                  label="Application Updates"
                  checked={preferences.applicationUpdates}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, applicationUpdates: checked })
                  }
                />
                <PreferenceItem
                  label="Exam Reminders"
                  checked={preferences.examReminders}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, examReminders: checked })
                  }
                />
                <PreferenceItem
                  label="Newsletter & Research"
                  checked={preferences.newsletter}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, newsletter: checked })
                  }
                />
              </div>
            </div>
          </motion.section>

          <div className="pt-4 flex flex-col gap-4">
            <button
              onClick={handleSave}
              disabled={updateCandidate.isPending}
              className="bg-primary text-surface-container-lowest py-4 rounded-md font-bold text-sm tracking-wide shadow-lg hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {updateCandidate.isPending ? 'Saving...' : 'Save All Changes'}
            </button>
            <button
              onClick={() => logout.mutate()}
              className="bg-surface-container-high text-error py-4 rounded-md font-bold text-sm tracking-wide hover:bg-error-container transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>
      </motion.div>
        </div>
      </main>

      <footer className="w-full py-12 mt-auto bg-surface border-t border-outline-variant/15 ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-sm font-bold text-primary">SEAS Engineering Excellence</span>
            <p className="text-xs tracking-wide text-on-surface-variant">© 2024 SEAS Engineering Excellence. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Institutional Privacy', 'Accessibility', 'Technical Standards', 'Contact SEAS'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="text-xs tracking-wide text-on-surface-variant hover:text-secondary transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
    </label>
  );
}

function PreferenceItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-on-surface">{label}</div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}