import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../../services/db';
import { recruitmentTeams } from '../../data/recruitment';

const STATUSES = ['Pending Review', 'Reviewed', 'Shortlisted', 'Rejected'];

const StatCard = ({ label, value, accent }) => (
  <div className="p-5 rounded-2xl border border-line bg-surface">
    <p className={`text-xs font-medium ${accent || 'text-ink-2'}`}>{label}</p>
    <p className="text-3xl font-bold text-ink mt-1.5">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApplications();
        if (!cancelled) setApplications(data);
      } catch {
        if (!cancelled) setError('Could not load applications. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = applications?.length || 0;
  const recent = applications ? [...applications].slice(0, 5) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-2 mt-1">
          Recruitment overview for GDG ViMEET 2026-27.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 rounded-2xl border border-line bg-surface">
          <span className="inline-block size-6 rounded-full border-2 border-line-strong border-t-primary animate-spin mb-3" />
          <p className="text-ink-2 text-sm">Loading dashboard…</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 rounded-2xl border border-danger/30 bg-danger-tint">
          <p className="text-danger text-sm">{error}</p>
        </div>
      ) : total === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-line-strong bg-surface">
          <p className="text-ink text-lg font-semibold mb-1">No applications yet</p>
          <p className="text-ink-2 text-sm">
            Submissions from the recruitment form will show up here.
          </p>
        </div>
      ) : (
        <>
          {/* Top-line metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Applicants" value={total} />
            {STATUSES.map((status) => (
              <StatCard
                key={status}
                label={status}
                value={applications.filter((a) => (a.status || 'Pending Review') === status).length}
              />
            ))}
          </div>

          {/* Per-team breakdown */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-ink-2 uppercase tracking-wider mb-3">
              Applications by Team
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recruitmentTeams.map((team) => (
                <div key={team.id} className="rounded-xl border border-line bg-surface p-4">
                  <p className="text-ink text-sm font-semibold">{team.name}</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    {applications.filter((a) => a.teams?.includes(team.id)).length}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent applications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-ink-2 uppercase tracking-wider">
                Recent Applications
              </h2>
              <Link to="/admin/applications" className="text-xs text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="rounded-2xl border border-line bg-surface divide-y divide-line overflow-hidden">
              {recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{app.fullName}</p>
                    <p className="text-xs text-ink-2 truncate">
                      {(app.teams || []).join(', ') || 'No team selected'}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-line text-ink-2">
                    {app.status || 'Pending Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
