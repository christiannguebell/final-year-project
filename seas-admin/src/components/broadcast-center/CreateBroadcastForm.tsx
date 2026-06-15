import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, Bold, Italic, Link2, Image, Send, Calendar } from 'lucide-react';
import { useBroadcastNotification } from '@/hooks/useNotifications';
import { toast } from 'sonner';

export default function CreateBroadcastForm() {
  const [channel, setChannel] = useState<'Email' | 'SMS' | 'Portal'>('Email');
  const [audience, setAudience] = useState('All Candidates');
  const [template, setTemplate] = useState('Standard Announcement');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { mutate, isPending } = useBroadcastNotification();

  const handleSendNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      toast.error('Subject and Message Body are required.');
      return;
    }

    const role = audience === 'All Candidates' ? 'CANDIDATE' : 'ADMIN';

    mutate(
      {
        title: subject,
        message: body,
        role,
      },
      {
        onSuccess: () => {
          toast.success('Broadcast sent successfully!');
          setSubject('');
          setBody('');
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to dispatch broadcast.');
        },
      }
    );
  };

  const handleSchedule = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      toast.error('Subject and Message Body are required.');
      return;
    }
    toast.success(`Broadcast scheduled for targeting group: ${audience}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm flex flex-col space-y-5">
      <h3 className="text-md font-headline font-bold text-primary flex items-center gap-2">
        <Send className="w-4 h-4 text-primary" /> Create Broadcast
      </h3>

      <form onSubmit={handleSendNow} className="space-y-4">
        {/* Channel Selection */}
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            Communication Channels
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChannel('Email')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all ${
                channel === 'Email'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline-variant/30 text-on-surface-variant/70 hover:bg-slate-50'
              }`}
            >
              <Mail className="w-5 h-5 mb-1" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setChannel('SMS')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all ${
                channel === 'SMS'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline-variant/30 text-on-surface-variant/70 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              SMS
            </button>
            <button
              type="button"
              onClick={() => setChannel('Portal')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all ${
                channel === 'Portal'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline-variant/30 text-on-surface-variant/70 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-5 h-5 mb-1" />
              Portal
            </button>
          </div>
        </div>

        {/* Target Audience Group */}
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            Target Audience Group
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-medium"
          >
            <option value="All Candidates">All Candidates</option>
            <option value="Selected Programs">Selected Programs</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        {/* Message Template */}
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            Message Template
          </label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer font-medium"
          >
            <option value="Standard Announcement">Standard Announcement</option>
            <option value="Urgent Warning">Urgent Warning</option>
            <option value="Payment Reminder">Payment Reminder</option>
          </select>
        </div>

        {/* Subject Line */}
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter broadcast subject..."
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none"
            required
          />
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
            Message Body
          </label>
          <div className="border border-outline-variant/30 rounded-lg overflow-hidden flex flex-col">
            {/* Tool Bar */}
            <div className="flex gap-2 p-2 bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant/80">
              <button type="button" className="p-1 hover:bg-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
              <button type="button" className="p-1 hover:bg-slate-200 rounded transition-colors"><Italic className="w-4 h-4" /></button>
              <button type="button" className="p-1 hover:bg-slate-200 rounded transition-colors"><Link2 className="w-4 h-4" /></button>
              <button type="button" className="p-1 hover:bg-slate-200 rounded transition-colors"><Image className="w-4 h-4" /></button>
            </div>
            {/* Textarea */}
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Compose your message here using engineering-precision formatting..."
              className="w-full p-4 text-sm text-primary outline-none resize-none border-none bg-white"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleSchedule}
            className="w-full flex items-center justify-center gap-1.5 py-3 border border-outline-variant/30 hover:bg-slate-50 text-primary rounded-lg text-xs font-bold transition-all"
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-1.5 py-3 bg-secondary text-white hover:opacity-90 rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isPending ? 'Sending...' : 'Send Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
