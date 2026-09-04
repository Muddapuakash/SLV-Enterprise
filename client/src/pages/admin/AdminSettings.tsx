import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { Settings, Save, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Globe } from 'lucide-react';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState('');

  const { data: settingsList, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await api.get('/api/admin/settings');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (settingsList && Array.isArray(settingsList)) {
      const map = settingsList.reduce(
        (acc: Record<string, string>, s: any) => ({ ...acc, [s.key]: s.value }),
        {}
      );
      setSettingsMap(map);
    }
  }, [settingsList]);

  const updateMutation = useMutation({
    mutationFn: async (entries: { key: string; value: string }[]) => {
      await Promise.all(
        entries.map((e) => api.put(`/api/admin/settings/${e.key}`, { value: e.value }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save settings');
    },
  });

  const handleChange = (key: string, value: string) => {
    setSettingsMap((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entries = Object.entries(settingsMap).map(([key, value]) => ({ key, value }));
    updateMutation.mutate(entries);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <SEO title="Business Settings & CMS | Admin Console" />

      <div>
        <h1 className="text-xl font-bold text-slate-900">CMS &amp; Business Settings</h1>
        <p className="text-xs text-slate-500">
          Centrally configure business contact info, headline copy, and WhatsApp numbers without changing code
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Business settings successfully saved and applied.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 skeleton" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Group 1: Company Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Company Branding</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="sv-label">Company Legal / Brand Name</label>
                <input
                  type="text"
                  value={settingsMap['company_name'] || 'SV Enterprises'}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="sv-input text-xs"
                />
              </div>

              <div>
                <label className="sv-label">Brand Tagline</label>
                <input
                  type="text"
                  value={settingsMap['company_tagline'] || 'Fast. Reliable. Always.'}
                  onChange={(e) => handleChange('company_tagline', e.target.value)}
                  className="sv-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Contact Numbers & WhatsApp */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Helpline &amp; WhatsApp Configuration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="sv-label">Primary Phone (Helpline)</label>
                <input
                  type="text"
                  value={settingsMap['company_phone_1'] || '9620406789'}
                  onChange={(e) => handleChange('company_phone_1', e.target.value)}
                  className="sv-input text-xs"
                />
              </div>

              <div>
                <label className="sv-label">Secondary Phone (Support)</label>
                <input
                  type="text"
                  value={settingsMap['company_phone_2'] || '6302249065'}
                  onChange={(e) => handleChange('company_phone_2', e.target.value)}
                  className="sv-input text-xs"
                />
              </div>

              <div>
                <label className="sv-label">WhatsApp Number (with 91)</label>
                <input
                  type="text"
                  value={settingsMap['whatsapp_number'] || '919620406789'}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  className="sv-input text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="sv-label">Primary Email</label>
              <input
                type="email"
                value={settingsMap['company_email'] || 'sventerprises161718@gmail.com'}
                onChange={(e) => handleChange('company_email', e.target.value)}
                className="sv-input text-xs"
              />
            </div>
          </div>

          {/* Group 3: Location */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Bangalore Operational Address</span>
            </h3>

            <div>
              <label className="sv-label">Full Street Address</label>
              <textarea
                rows={2}
                value={
                  settingsMap['company_address'] ||
                  'Krishnamurti Building, No. 127, 3rd Cross, near FCI Main Road, Vijinapura, Dooravani Nagar, Bengaluru, Karnataka 560016'
                }
                onChange={(e) => handleChange('company_address', e.target.value)}
                className="sv-input text-xs"
              />
            </div>

            <div>
              <label className="sv-label">Primary Landmark</label>
              <input
                type="text"
                value={settingsMap['company_landmark'] || 'Directly opposite FCI Godown, near Balamurli Temple'}
                onChange={(e) => handleChange('company_landmark', e.target.value)}
                className="sv-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="sv-label">Locality / Area</label>
                <input
                  type="text"
                  value={settingsMap['company_area'] || 'Vijinapura, Dooravani Nagar'}
                  onChange={(e) => handleChange('company_area', e.target.value)}
                  className="sv-input text-xs"
                />
              </div>
              <div>
                <label className="sv-label">City</label>
                <input
                  type="text"
                  value={settingsMap['company_city'] || 'Bengaluru'}
                  onChange={(e) => handleChange('company_city', e.target.value)}
                  className="sv-input text-xs"
                />
              </div>
              <div>
                <label className="sv-label">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={settingsMap['company_pincode'] || '560016'}
                  onChange={(e) => handleChange('company_pincode', e.target.value)}
                  className="sv-input text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="sv-label">Broadband ISP Partners</label>
              <input
                type="text"
                value={settingsMap['company_partners'] || 'Hathway, Excitel'}
                onChange={(e) => handleChange('company_partners', e.target.value)}
                className="sv-input text-xs"
              />
            </div>
          </div>

          {/* Group 4: Homepage Copy */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Hero Copywriting</span>
            </h3>

            <div>
              <label className="sv-label">Hero Headline</label>
              <input
                type="text"
                value={settingsMap['hero_headline'] || 'Fast Internet. Reliable Connections.'}
                onChange={(e) => handleChange('hero_headline', e.target.value)}
                className="sv-input text-xs"
              />
            </div>

            <div>
              <label className="sv-label">Hero Subtext</label>
              <textarea
                rows={2}
                value={
                  settingsMap['hero_subtext'] ||
                  'Connecting homes and businesses with high-speed internet, WiFi, CCTV and professional networking solutions.'
                }
                onChange={(e) => handleChange('hero_subtext', e.target.value)}
                className="sv-input text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary py-3 px-8 text-xs font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{updateMutation.isPending ? 'Saving...' : 'Save All Settings'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
