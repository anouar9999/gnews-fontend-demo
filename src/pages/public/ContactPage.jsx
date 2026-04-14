import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ICON_MAP = { Email: Mail, Press: MessageSquare, 'Based in': MapPin };

const DEFAULTS = {
  info: [
    { title: 'Email',    val: 'hello@gnewz.com' },
    { title: 'Press',    val: 'press@gnewz.com' },
    { title: 'Based in', val: 'Global — Remote' },
  ],
  topics: ['General Inquiry', 'Press & Media', 'Advertising', 'Technical Issue', 'Content Submission', 'Other'],
};

export default function ContactPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState(DEFAULTS);
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/pages/contact/').then(r => setContent(r.data.content)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(t('contact.successMsg'));
    setForm({ name: '', email: '', topic: '', message: '' });
    setLoading(false);
  };

  const inputCls = 'w-full bg-[#111] border border-[#2a2a2a] text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600';

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <div className="py-20 px-6 text-center">
        <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-4">{t('contact.label')}</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">{t('contact.heading')}</h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          {t('contact.desc')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Info cards */}
        <div className="flex flex-col gap-4">
          {content.info.map(({ title, val }) => {
            const Icon = ICON_MAP[title] ?? Mail;
            return (
              <div key={title} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-5 flex gap-4 items-start">
                <div className="w-9 h-9 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{title}</p>
                  <p className="text-white text-sm font-medium">{val}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">{t('contact.nameLbl')}</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('contact.namePh')} required className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">{t('contact.emailLbl')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t('contact.emailPh')} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">{t('contact.topicLbl')}</label>
            <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className={inputCls + ' [&>option]:bg-[#111]'}>
              <option value="">{t('contact.topicPh')}</option>
              {content.topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">{t('contact.messageLbl')}</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t('contact.messagePh')} required rows={5} className={inputCls + ' resize-none'} />
          </div>

          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-[#FF6B00] hover:bg-[#cc5500] disabled:opacity-50 text-white text-sm font-black rounded-xl transition-colors">
            <Send size={15} />
            {loading ? t('contact.sending') : t('contact.sendBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}
