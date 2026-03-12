import { useState } from 'react';
import { Save, Globe, FileText, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1A1A1A]">
        <div className="p-2 bg-[#FF6B00]/10 rounded-lg">
          <Icon size={18} className="text-[#FF6B00]" />
        </div>
        <h2 className="text-white font-bold">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
      <div className="sm:w-48 shrink-0">
        <p className="text-sm font-medium text-gray-300">{label}</p>
        {hint && <p className="text-xs text-gray-600 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[#FF6B00]' : 'bg-[#333]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

const inputCls = 'w-full bg-[#1A1A1A] border border-[#333] text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FF6B00] transition-colors';
const selectCls = `${inputCls} cursor-pointer`;

export default function AdminSettings() {
  const [general, setGeneral] = useState({
    siteName: 'GNEWZ',
    siteDescription: 'Morocco\'s #1 Gaming & Esports News Platform',
    defaultLanguage: 'en',
    timezone: 'Africa/Casablanca',
  });

  const [content, setContent] = useState({
    articlesPerPage: 20,
    autoPublishAI: false,
    breakingNewsDuration: 24,
    enableComments: true,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newArticleAlerts: false,
    systemAlerts: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#cc5500] text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Save size={15} /> Save Changes
        </button>
      </div>

      {/* General */}
      <Section icon={Globe} title="General Settings">
        <Field label="Site Name">
          <input
            value={general.siteName}
            onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Site Description">
          <textarea
            value={general.siteDescription}
            onChange={(e) => setGeneral({ ...general, siteDescription: e.target.value })}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </Field>
        <Field label="Default Language">
          <select
            value={general.defaultLanguage}
            onChange={(e) => setGeneral({ ...general, defaultLanguage: e.target.value })}
            className={selectCls}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select
            value={general.timezone}
            onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
            className={selectCls}
          >
            <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
            <option value="UTC">UTC</option>
            <option value="Europe/Paris">Europe/Paris (GMT+2)</option>
          </select>
        </Field>
      </Section>

      {/* Content */}
      <Section icon={FileText} title="Content Settings">
        <Field label="Articles per page" hint="Number shown in listings">
          <input
            type="number"
            min={5}
            max={100}
            value={content.articlesPerPage}
            onChange={(e) => setContent({ ...content, articlesPerPage: Number(e.target.value) })}
            className={`${inputCls} w-24`}
          />
        </Field>
        <Field label="Auto-publish AI drafts" hint="Automatically publish AI-generated articles">
          <Toggle
            checked={content.autoPublishAI}
            onChange={(v) => setContent({ ...content, autoPublishAI: v })}
          />
        </Field>
        <Field label="Breaking news duration" hint="Hours before a story is no longer breaking">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={72}
              value={content.breakingNewsDuration}
              onChange={(e) => setContent({ ...content, breakingNewsDuration: Number(e.target.value) })}
              className={`${inputCls} w-24`}
            />
            <span className="text-gray-500 text-sm">hours</span>
          </div>
        </Field>
        <Field label="Enable comments">
          <Toggle
            checked={content.enableComments}
            onChange={(v) => setContent({ ...content, enableComments: v })}
          />
        </Field>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <Field label="Email notifications" hint="Receive alerts via email">
          <Toggle
            checked={notifications.emailNotifications}
            onChange={(v) => setNotifications({ ...notifications, emailNotifications: v })}
          />
        </Field>
        <Field label="New article alerts" hint="Notify when articles are submitted">
          <Toggle
            checked={notifications.newArticleAlerts}
            onChange={(v) => setNotifications({ ...notifications, newArticleAlerts: v })}
          />
        </Field>
        <Field label="System alerts" hint="Critical system notifications">
          <Toggle
            checked={notifications.systemAlerts}
            onChange={(v) => setNotifications({ ...notifications, systemAlerts: v })}
          />
        </Field>
      </Section>

    </div>
  );
}
