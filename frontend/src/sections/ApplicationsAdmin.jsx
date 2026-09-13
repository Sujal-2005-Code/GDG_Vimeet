import { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus, exportToCsv } from '../services/db';
import { recruitmentTeams } from '../data/recruitment';

const GRAPHICS_TEAM_ID = 'Graphics & Design';
const TECHNICAL_TEAM_ID = 'Technical';
const EVENT_MANAGEMENT_TEAM_ID = 'Event Management';
const CONTENT_TEAM_ID = 'Content & Social Media';

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        setError(
          err.status === 401
            ? 'Your admin session has expired. Please sign in again.'
            : 'Could not load applications. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateApplicationStatus(id, newStatus);
      setApplications(updated);
    } catch (err) {
      setError(
        err.status === 401
          ? 'Your admin session has expired. Please sign in again.'
          : 'Could not update status. Please try again.'
      );
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeam =
      selectedTeam === 'All' || (app.teams && app.teams.includes(selectedTeam));

    const matchesYear =
      selectedYear === 'All' || app.year === selectedYear;

    return matchesSearch && matchesTeam && matchesYear;
  });

  const graphicsAppsCount = applications.filter(
    (app) => app.teams && app.teams.includes(GRAPHICS_TEAM_ID)
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Recruitment Applications 2026-27
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Review candidate details, filter team choices, evaluate Ganesh Chaturthi poster links, and export to CSV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCsv(filteredApps)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 text-sm transition shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV ({filteredApps.length})
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
              <p className="text-xs text-white/60">Total Applicants</p>
              <p className="text-2xl font-bold text-white mt-1">{applications.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-purple-500/30">
              <p className="text-xs text-purple-300">Graphics Poster Submissions</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{graphicsAppsCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-blue-500/30">
              <p className="text-xs text-blue-300">Technical Team Applicants</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {applications.filter((a) => a.teams?.includes(TECHNICAL_TEAM_ID)).length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-amber-500/30">
              <p className="text-xs text-amber-300">Event & Media Applicants</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                {applications.filter((a) => a.teams?.includes(EVENT_MANAGEMENT_TEAM_ID) || a.teams?.includes(CONTENT_TEAM_ID)).length}
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full sm:w-72 relative">
              <span className="absolute left-3 top-2.5 text-white/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, roll no, email..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#00AEEF] focus:outline-none"
              />
            </div>

            {/* Team Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-white/60 whitespace-nowrap">Team:</span>
              {['All', ...recruitmentTeams.map((t) => t.id)].map((team) => (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                    selectedTeam === team
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {team === 'All' ? 'All Teams' : team}
                </button>
              ))}
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/60">Year:</span>
              {['All', 'FE', 'SE', 'TE', 'BE'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-md text-xs transition border ${
                    selectedYear === yr
                      ? 'bg-[#00AEEF] text-black border-[#00AEEF] font-bold'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List / Table */}
          {isLoading ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/60 text-base">Loading applications from server...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04]">
              <p className="text-rose-300 text-sm mb-2">{error}</p>
              <a href="/admin" className="text-sm text-google-blue hover:underline">
                Go to sign in
              </a>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/60 text-base">No applications match your current filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTeam('All');
                  setSelectedYear('All');
                }}
                className="mt-3 text-sm text-[#00AEEF] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => {
                const isGraphics = app.teams?.includes(GRAPHICS_TEAM_ID);
                return (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-white">{app.fullName}</h3>
                          <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 text-xs font-mono font-medium">
                            {app.rollNo}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#0066B1]/30 text-[#00AEEF] text-xs font-semibold">
                            {app.year} • {app.department}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                          Applied: {new Date(app.submittedAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Status:</span>
                        <select
                          value={app.status || 'Pending Review'}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition ${
                            app.status === 'Shortlisted'
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                              : app.status === 'Reviewed'
                              ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                              : 'bg-black/60 border-white/20 text-white/80'
                          }`}
                        >
                          <option value="Pending Review" className="bg-neutral-900 text-white">Pending Review</option>
                          <option value="Reviewed" className="bg-neutral-900 text-white">Reviewed</option>
                          <option value="Shortlisted" className="bg-neutral-900 text-white">Shortlisted</option>
                          <option value="Rejected" className="bg-neutral-900 text-white">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-white/50 block text-xs mb-1">Contact Details:</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={`https://wa.me/91${app.mobile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92z"/>
                            </svg>
                            +91 {app.mobile} (WhatsApp)
                          </a>
                          <span className="text-white/30">•</span>
                          <a href={`mailto:${app.email}`} className="text-white/80 hover:text-white underline">
                            {app.email}
                          </a>
                        </div>

                        {app.motivation && (
                          <div className="mt-3">
                            <span className="text-white/50 block text-xs mb-0.5">Motivation & Experience:</span>
                            <p className="text-white/80 bg-black/30 p-2.5 rounded-lg text-xs leading-relaxed">
                              {app.motivation}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-white/50 block text-xs mb-1">Applied Teams:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(app.teams || []).map((t) => (
                            <span
                              key={t}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                t === GRAPHICS_TEAM_ID
                                  ? 'bg-purple-950/40 text-purple-300 border-purple-500/40'
                                  : t === TECHNICAL_TEAM_ID
                                  ? 'bg-blue-950/40 text-blue-300 border-blue-500/40'
                                  : 'bg-white/5 text-white/80 border-white/10'
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Graphics Poster Drive Link */}
                        {isGraphics && (
                          <div className="mt-3 p-3 rounded-xl border border-purple-500/30 bg-purple-950/20">
                            <span className="text-purple-300 font-semibold text-xs flex items-center gap-1.5 mb-1">
                              <span>🎨</span> Ganesh Chaturthi Poster Drive Link:
                            </span>
                            {app.graphicsDriveLink ? (
                              <a
                                href={app.graphicsDriveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#00AEEF] hover:underline text-xs break-all"
                              >
                                {app.graphicsDriveLink}
                                <svg className="w-3.5 h-3.5 ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-rose-400 text-xs italic">No link provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
    </div>
  );
};

export default ApplicationsAdmin;
