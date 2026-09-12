import { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import NavBar from './NavBar';
import Footer from '../components/Footer';
import { saveApplication } from '../services/db';
import { recruitmentTeams } from '../data/recruitment';

const TEAM_ICONS = {
  content: (
    <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  events: (
    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  pr: (
    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  technical: (
    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  graphics: (
    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

const TEAMS = recruitmentTeams.map((team) => ({ ...team, icon: TEAM_ICONS[team.iconKey] }));

const GRAPHICS_TEAM_ID = 'Graphics & Design';

const DEPARTMENTS = [
  'Computer Engineering',
  'CSE (AI & ML)',
  'Information Technology',
  'Electronics & Telecommunication (EXTC)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'First Year (All Branches)'
];

const YEARS = ['FE', 'SE', 'TE', 'BE'];

const Recruitment = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    department: 'Computer Engineering',
    year: 'SE',
    mobile: '',
    email: '',
    teams: [],
    graphicsDriveLink: '',
    motivation: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleTeam = (teamId) => {
    setFormData((prev) => {
      const exists = prev.teams.includes(teamId);
      const updated = exists
        ? prev.teams.filter((t) => t !== teamId)
        : [...prev.teams, teamId];
      return { ...prev, teams: updated };
    });
    if (errors.teams) {
      setErrors((prev) => ({ ...prev, teams: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Please enter your college roll number.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.teams.length) {
      newErrors.teams = 'Please select at least one team you want to join.';
    }

    // Conditional check for Graphics team
    if (formData.teams.includes(GRAPHICS_TEAM_ID)) {
      if (!formData.graphicsDriveLink.trim()) {
        newErrors.graphicsDriveLink = 'Please provide your Google Drive link for the Ganesh Chaturthi poster.';
      } else if (!formData.graphicsDriveLink.includes('http')) {
        newErrors.graphicsDriveLink = 'Please enter a valid URL (starting with https://).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 380, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveApplication(formData);
      setSubmittedData(result.data);
      setIsSubmitting(false);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }

      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      rollNo: '',
      department: 'Computer Engineering',
      year: 'SE',
      mobile: '',
      email: '',
      teams: [],
      graphicsDriveLink: '',
      motivation: ''
    });
    setSubmittedData(null);
    setErrors({});
  };

  return (
    <main className="min-h-screen text-white bg-black">
      <NavBar />

      <div className="black-gradient-bg min-h-dvh pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="relative md:static md:top-auto md:left-auto md:w-auto md:px-0 !px-0 !pt-2 mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li className="opacity-60">/</li>
              <li className="text-white font-medium">Recruitment 2026-27</li>
            </ol>
          </nav>

          {/* Header Banner */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00AEEF] mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
              Applications Open • ViMEET 2026-27
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-round-bold font-extrabold tracking-tight bg-gradient-to-r from-[#0066B1] via-[#00AEEF] to-[#E60C2C] bg-clip-text text-transparent">
              Join GDG ViMEET
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Become part of Vishwaniketan's official Google Developer Groups on Campus. Learn, lead, build high-impact tech, and shape developer culture.
            </p>

            {/* Quick Benefits Chips */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-5 text-xs sm:text-sm text-white/75">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">✨ Hands-on Project Labs</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">🤝 Google Mentorship</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">🚀 Hackathons & Tech Talks</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">📜 Certificate & GDG Swag</span>
            </div>
          </div>

          {/* Main Content Area */}
          {submittedData ? (
            /* Submission Success Card */
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl p-8 sm:p-12 text-center shadow-2xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-5 border border-emerald-500/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Application Submitted Successfully!</h2>
              <p className="text-white/80 max-w-md mx-auto text-sm sm:text-base">
                Thank you, <span className="font-semibold text-white">{submittedData.fullName}</span>. We have received your application for GDG ViMEET.
              </p>

              <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/10 text-left max-w-lg mx-auto space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Application ID:</span>
                  <span className="font-mono text-[#00AEEF]">{submittedData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Department & Year:</span>
                  <span className="text-white">{submittedData.department} ({submittedData.year})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Selected Teams:</span>
                  <span className="text-white font-medium">{(submittedData.teams || []).join(', ')}</span>
                </div>
                {submittedData.graphicsDriveLink && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-white/60 block text-xs">Ganesh Chaturthi Poster Drive Link:</span>
                    <a
                      href={submittedData.graphicsDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00AEEF] hover:underline text-xs break-all"
                    >
                      {submittedData.graphicsDriveLink}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-lg mx-auto mb-8 text-xs sm:text-sm text-white/80 text-left">
                <p className="font-semibold text-white mb-1">📢 Next Steps:</p>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  <li>Our team will review your application and portfolio/poster submissions.</li>
                  <li>Shortlisted students will receive an email/WhatsApp update for the interview round.</li>
                  <li>Follow our official Instagram <a href="https://www.instagram.com/gdgvimeet" target="_blank" rel="noreferrer" className="text-[#00AEEF] hover:underline">@gdgvimeet</a> for announcements.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/"
                  className="rounded-full bg-white text-black font-semibold px-6 py-2.5 hover:bg-white/90 transition text-sm"
                >
                  Return to Home
                </Link>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/20 text-white/90 hover:bg-white/10 transition px-6 py-2.5 text-sm"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {errors.form && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm">
                  {errors.form}
                </div>
              )}

              {/* SECTION 1: Personal Details */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-full bg-[#0066B1]/30 text-[#00AEEF] flex items-center justify-center text-xs font-bold">1</span>
                  <h2 className="text-xl font-semibold text-white">Student Details</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full rounded-xl border ${errors.fullName ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 bg-black/40'} px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#00AEEF] focus:outline-none focus:ring-1 focus:ring-[#00AEEF] transition`}
                    />
                    {errors.fullName && <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Roll Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      placeholder="e.g. 23CE045"
                      className={`w-full rounded-xl border ${errors.rollNo ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 bg-black/40'} px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#00AEEF] focus:outline-none focus:ring-1 focus:ring-[#00AEEF] transition`}
                    />
                    {errors.rollNo && <p className="text-rose-400 text-xs mt-1">{errors.rollNo}</p>}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Department / Branch <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-[#00AEEF] focus:outline-none focus:ring-1 focus:ring-[#00AEEF] transition"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-neutral-900 text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Year of Study <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {YEARS.map((yr) => {
                        const isSelected = formData.year === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, year: yr }))}
                            className={`py-2 rounded-xl text-xs font-semibold transition border ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-md'
                                : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      WhatsApp / Mobile No. <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-white/50 text-sm font-mono">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl border ${errors.mobile ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 bg-black/40'} text-sm text-white placeholder-white/40 focus:border-[#00AEEF] focus:outline-none focus:ring-1 focus:ring-[#00AEEF] transition font-mono`}
                      />
                    </div>
                    {errors.mobile && <p className="text-rose-400 text-xs mt-1">{errors.mobile}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@vimeet.ac.in"
                      className={`w-full rounded-xl border ${errors.email ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 bg-black/40'} px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#00AEEF] focus:outline-none focus:ring-1 focus:ring-[#00AEEF] transition`}
                    />
                    {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Team Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00AEEF]/30 text-[#00AEEF] flex items-center justify-center text-xs font-bold">2</span>
                    <h2 className="text-xl font-semibold text-white">Select Teams to Join</h2>
                  </div>
                  <span className="text-xs text-white/60">
                    {formData.teams.length ? `${formData.teams.length} selected` : 'Multi-select allowed'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mb-4">
                  You can select more than one team if you are interested in multiple domains!
                </p>

                {errors.teams && (
                  <div className="p-3 mb-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                    {errors.teams}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {TEAMS.map((team) => {
                    const isSelected = formData.teams.includes(team.id);
                    return (
                      <div
                        key={team.id}
                        onClick={() => toggleTeam(team.id)}
                        className={`group cursor-pointer rounded-xl border p-4 transition duration-200 relative ${
                          isSelected
                            ? `border-white bg-white/10 shadow-[0_0_20px_rgba(0,174,239,0.2)]`
                            : `border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20`
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                              {team.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white group-hover:text-[#00AEEF] transition">
                                {team.name}
                              </h3>
                              <span className="inline-block text-[11px] text-white/60 font-medium">
                                {team.badge}
                              </span>
                            </div>
                          </div>

                          {/* Custom Checkbox */}
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                              isSelected
                                ? 'bg-[#00AEEF] border-[#00AEEF] text-black'
                                : 'border-white/30 bg-transparent'
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-white/70 mt-2.5 line-clamp-2">
                          {team.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Conditional Graphics Team Challenge */}
              {formData.teams.includes(GRAPHICS_TEAM_ID) && (
                <div className="mb-8 p-5 sm:p-6 rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-black/60 to-purple-900/20 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🕉️</span>
                    <h3 className="text-lg font-bold text-white">Graphics & Design Team Recruitment Challenge</h3>
                    <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Mandatory Task
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-white/80 my-3">
                    <p>
                      To shortlist designers for the Graphics & Design Team, please design an original <strong>Ganesh Chaturthi Poster</strong>!
                    </p>
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-white/75">
                      <p className="font-semibold text-purple-300">📋 Submission Guidelines:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>You may use <strong>Photoshop, Illustrator, Figma, or Canva</strong>.</li>
                        <li>Export your poster as JPG/PNG or PDF and upload it to your <strong>Google Drive</strong>.</li>
                        <li><span className="text-amber-300 font-semibold">Important:</span> Set sharing permissions to <strong>"Anyone with the link can view"</strong> so our evaluation panel can open it.</li>
                        <li>Paste your Google Drive link below:</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/90 mb-1.5">
                      Google Drive Link for Ganesh Chaturthi Poster <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-3 text-white/50">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="graphicsDriveLink"
                        value={formData.graphicsDriveLink}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/file/d/... or folder link"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                          errors.graphicsDriveLink ? 'border-rose-500 bg-rose-500/10' : 'border-purple-500/30 bg-black/60'
                        } text-sm text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition font-mono`}
                      />
                    </div>
                    {errors.graphicsDriveLink && (
                      <p className="text-rose-400 text-xs mt-1">{errors.graphicsDriveLink}</p>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 4: Motivation / Links (Optional) */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <h2 className="text-xl font-semibold text-white">Why GDG ViMEET? <span className="text-xs text-white/50 font-normal">(Optional)</span></h2>
                </div>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Share any past experience, projects, or why you would love to be part of GDG ViMEET (include your GitHub, LinkedIn, or portfolio link if available)..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#00AEEF] focus:outline-none focus:ring-1 focus:ring-[#00AEEF] transition"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-white/60 text-center sm:text-left">
                  By submitting, you agree to receive interview updates on WhatsApp and email.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0066B1] via-[#00AEEF] to-[#E60C2C] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Lead Admin Shortcut Notice */}
          <div className="mt-8 text-center text-xs text-white/40">
            Are you a GDG Core Member?{' '}
            <Link to="/admin/applications" className="text-white/70 hover:text-white underline">
              View Applicant Dashboard
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Recruitment;
