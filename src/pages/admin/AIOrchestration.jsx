import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshCw, Play, Activity, Clock, Sliders, Percent,
  Globe, FileText, Film, CheckCircle, Terminal, Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SCRAPER_LOGS = [
  { id: 'JOB-8821', time: '10:42:05', source: 'Hespress',        headline: "Moroccan E-Sport Team 'Black Lotus' Qualifies for World", progress: 65, stage: 'Media',     score: 98, status: 'running' },
  { id: 'JOB-8820', time: '10:41:12', source: 'IGN Middle East', headline: 'Valorant Patch 8.04: Agents Nerfs and Map Changes Ana...', progress: 90, stage: 'Review',    score: 85, status: 'review' },
  { id: 'JOB-8819', time: '10:38:55', source: '2M.ma',           headline: 'Casablanca to Host North African Gaming Summit 2024',      progress: 100, stage: 'Published', score: 92, status: 'success' },
  { id: 'JOB-8818', time: '10:35:22', source: 'Kotaku',          headline: 'Grand Theft Auto VI: New Leaks Suggest Atlas Mountains',    progress: 35, stage: 'Summary',   score: 45, status: 'running' },
  { id: 'JOB-8817', time: '10:30:10', source: 'Rabat Today',     headline: 'AI Startups in Morocco: The New Silicon Valley of Africa?', progress: 10, stage: 'Scraping',  score: 0,  status: 'failed' },
];

const PIPELINE_STAGES = [
  { key: 'scraping',  label: 'Scraping',         icon: Globe,       status: 'processing', current: 12, max: 50 },
  { key: 'summary',   label: 'AI Summary',        icon: FileText,    status: 'processing', current: 8,  max: 20 },
  { key: 'media',     label: 'Media Gen',         icon: Film,        status: 'warning',    current: 4,  max: 10 },
  { key: 'review',    label: 'Ready for Review',  icon: CheckCircle, status: 'idle',       current: 25, max: 100 },
];

const STATUS_CFG = {
  running: { label: 'Running',    cls: 'bg-[#FF6B00]/20 text-orange-300 border-orange-500/30' },
  review:  { label: 'Review',     cls: 'bg-gray-500/20  text-gray-300  border-gray-500/30' },
  success: { label: 'Success',    cls: 'bg-green-500/20 text-green-300 border-green-500/30' },
  failed:  { label: 'Failed',     cls: 'bg-red-500       text-white' },
};

const LOG_FILTER = ['all', 'active', 'failed'];

function Toggle({ label, desc, value, onChange, danger }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0">
      <div>
        <p className={`text-sm font-semibold ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-[#FF6B00]' : 'bg-[#333]'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

export default function AIOrchestration() {
  const { t } = useTranslation();
  const [logFilter, setLogFilter] = useState('all');
  const [controls, setControls] = useState({ autoPublish: true, scraperEngine: true, emergencyStop: false });

  const setControl = (key) => (val) => setControls((c) => ({ ...c, [key]: val }));

  const filteredLogs = SCRAPER_LOGS.filter((l) => {
    if (logFilter === 'active') return l.status === 'running' || l.status === 'review';
    if (logFilter === 'failed') return l.status === 'failed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">{t('ai.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('ai.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Refreshed')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 border border-[#333] rounded-lg hover:border-[#FF6B00] transition-colors"
          >
            <RefreshCw size={14} /> {t('ai.refresh')}
          </button>
          <button
            onClick={() => toast.success('Manual job started')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#cc5500] rounded-lg transition-colors"
          >
            <Play size={14} /> {t('ai.runManualJob')}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Activity size={18} className="text-[#FF6B00]" />
            <span className="text-green-400 text-xs font-bold">+12%</span>
          </div>
          <p className="text-white text-2xl font-bold">1,284</p>
          <p className="text-gray-500 text-xs mt-1">{t('ai.totalJobs')}</p>
          <p className="text-gray-600 text-[11px] mt-0.5">Success rate: 98.2%</p>
        </div>

        {/* Avg Processing */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock size={18} className="text-[#FF6B00]" />
            <span className="text-red-400 text-xs font-bold">-5%</span>
          </div>
          <p className="text-white text-2xl font-bold">2m 14s</p>
          <p className="text-gray-500 text-xs mt-1">{t('ai.avgProcessing')}</p>
          <p className="text-gray-600 text-[11px] mt-0.5">Scrape to Publish</p>
        </div>

        {/* System Controls */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sliders size={18} className="text-[#FF6B00]" />
            <p className="text-white text-sm font-bold">{t('ai.systemControls')}</p>
          </div>
          <Toggle label={t('ai.autoPublish')}    desc={t('ai.autoPublishDesc')}    value={controls.autoPublish}    onChange={setControl('autoPublish')} />
          <Toggle label={t('ai.scraperEngine')}  desc={t('ai.scraperEngineDesc')}  value={controls.scraperEngine}  onChange={setControl('scraperEngine')} />
          <Toggle label={t('ai.emergencyStop')}  desc={t('ai.emergencyStopDesc')}  value={controls.emergencyStop}  onChange={setControl('emergencyStop')} danger />
        </div>

        {/* API Cost Tracker */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Percent size={18} className="text-[#FF6B00]" />
              <p className="text-white text-sm font-bold">{t('ai.apiCostTracker')}</p>
            </div>
            <span className="text-[#FF6B00] text-[10px] font-bold">{t('ai.monthly')}</span>
          </div>
          <p className="text-gray-500 text-[11px] mb-3">Estimated usage for current billing cycle</p>
          {[
            { name: 'OpenAI (GPT-4)', cost: '$142.50', dot: 'bg-green-400', pct: 36 },
            { name: 'Gemini Ultra',   cost: '$45.20',  dot: 'bg-blue-400',  pct: 11 },
            { name: 'Opus Clips',     cost: '$210.00', dot: 'bg-purple-400', pct: 53 },
          ].map(({ name, cost, dot, pct }) => (
            <div key={name} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-gray-400 text-[11px]">{name}</span>
                </div>
                <span className="text-white text-[11px] font-semibold">{cost}</span>
              </div>
              <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF6B00] rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
          <div className="pt-2 mt-1 border-t border-[#1A1A1A] flex items-center justify-between">
            <span className="text-gray-500 text-xs">{t('ai.totalSpend')}</span>
            <span className="text-white text-lg font-bold">$397.70</span>
          </div>
        </div>
      </div>

      {/* Live Workflow Status */}
      <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#FF6B00]" />
            <h2 className="text-white font-bold">{t('ai.liveWorkflow')}</h2>
          </div>
          <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {t('ai.systemHealthy')}
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE_STAGES.map(({ label, icon: Icon, status, current, max }) => (
            <div key={label} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className="text-[#FF6B00]" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  status === 'warning' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : status === 'idle' ? 'bg-gray-500/20 text-gray-400 border-gray-600/30'
                    : 'bg-gray-500/20 text-gray-400 border-gray-600/30'
                }`}>
                  {status}
                </span>
              </div>
              <p className="text-white text-sm font-semibold">{label}</p>
              <div className="mt-2 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B00] rounded-full"
                  style={{ width: `${(current / max) * 100}%` }}
                />
              </div>
              <p className="text-gray-500 text-[11px] mt-1">{current}/{max}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scraper Logs */}
      <div className="bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-[#FF6B00]" />
            <h2 className="text-white font-bold">{t('ai.scraperLogs')}</h2>
          </div>
          <div className="flex items-center gap-1">
            {LOG_FILTER.map((f) => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  logFilter === f ? 'bg-[#1A1A1A] text-white border border-[#333]' : 'text-gray-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {[t('ai.jobId'), t('dashboard.source'), t('ai.headline'), t('ai.currentStage'), t('ai.aiScore'), t('dashboard.status')].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const st = STATUS_CFG[log.status];
                return (
                  <tr key={log.id} className="border-b border-[#111] hover:bg-[#151515] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-mono text-xs font-bold">{log.id}</p>
                      <p className="text-gray-600 text-[11px]">{log.time}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 bg-[#1A1A1A] border border-[#333] text-gray-300 text-[11px] rounded-full font-medium">
                        {log.source}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-[220px]">
                      <p className="text-white text-xs truncate">{log.headline}</p>
                      <div className="mt-1.5 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${log.progress === 100 ? 'bg-green-400' : log.status === 'failed' ? 'bg-red-400' : 'bg-[#FF6B00]'}`}
                          style={{ width: `${log.progress}%` }}
                        />
                      </div>
                      <p className="text-gray-600 text-[10px] mt-0.5">{log.progress}%</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{log.stage}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold ${log.score >= 80 ? 'text-green-400' : log.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {log.score}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-bold border ${st?.cls}`}>
                        {st?.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
