import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import { MapPin, Server, Wifi, Lock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectDTO, ServiceType } from '@sv/shared';

const getServiceIcon = (service: ServiceType) => {
  switch (service) {
    case ServiceType.INTERNET:
      return <Zap className="w-4 h-4 text-blue-600" />;
    case ServiceType.WIFI:
      return <Wifi className="w-4 h-4 text-cyan-600" />;
    case ServiceType.CCTV:
      return <Lock className="w-4 h-4 text-emerald-600" />;
    case ServiceType.CABLING:
    default:
      return <Server className="w-4 h-4 text-purple-600" />;
  }
};

export default function ProjectsPage() {
  const { data: projectsData, isLoading } = useQuery<{ data: ProjectDTO[] }>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/api/projects');
      return res.data;
    },
  });

  const projects = projectsData?.data || [];

  return (
    <div className="bg-white">
      <SEO
        title="Completed Projects & Installations | SV Enterprises"
        description="View recent fiber broadband, structured cabling, WiFi deployments, and CCTV camera installations executed by SV Enterprises across Bangalore."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-14 hero-bg text-white">
        <div className="container-max section-px text-center">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Field Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Recent Projects &amp; Installations
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            A showcase of structured networking, broadband setups, and surveillance systems installed across Bangalore properties.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-py bg-slate-50">
        <div className="container-max section-px">
          
          {/* Transparent Notice about Sample/Demo data */}
          <div className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 max-w-3xl mx-auto">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Portfolio Notice:</span>
              Entries marked with <span className="badge-sample ml-1 mr-1">Sample / Demo</span> illustrate typical work scopes performed by our team. Live customer project photos are updated via the administrative portal as client privacy waivers are processed.
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 skeleton" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600">No projects currently listed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="sv-card bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Project Header Banner / Tech Illustration */}
                    <div className="h-44 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 flex flex-col justify-between relative">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-400/30">
                          {getServiceIcon(project.service)}
                          <span>{project.service}</span>
                        </span>

                        {project.isSample && (
                          <span className="badge-sample">Sample Showcase</span>
                        )}
                      </div>

                      <div className="text-white">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>{project.location}</span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-6">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Project Footer CTA */}
                  <div className="p-6 pt-0 mt-auto">
                    <Link
                      to="/request-service"
                      className="flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 pt-4 border-t border-slate-100"
                    >
                      <span>Request Similar Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Need Site Assessment CTA */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Have a Network Installation in Mind?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Whether you are rewiring an office or setting up high-density WiFi in a multi-story house, our technicians provide free initial feasibility consultations in Bangalore.
            </p>
            <div className="pt-2">
              <Link to="/request-service" className="btn-primary text-xs py-2.5 px-6">
                Request a Site Survey
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
