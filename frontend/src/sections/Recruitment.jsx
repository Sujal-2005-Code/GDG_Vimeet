import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import useReveal from '../animations/reveal';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { StatusChip } from '../components/ui/Chip';
import ColorStroke from '../components/ui/ColorStroke';
import Icon from '../components/ui/Icon';
import SocialIcon from '../components/ui/SocialIcon';
import { getRecruitmentCta, recruitmentTeams } from '../data/recruitment';
import site from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import { saveApplication } from '../services/db';
import { TEAM_ICON } from '../lib/teams';

const GRAPHICS_TEAM_ID = 'Graphics & Design';

// Keep in sync with backend/utils/validateApplication.js.
const DEPARTMENTS = [
  'Computer Engineering',
  'CSE (AIML)',
  'Mechanical',
  'EXTC',
  'Civil',
  'Electrical'
];

const YEARS = ['SE', 'TE', 'BE'];

const BENEFITS = [
  { icon: 'code', text: 'Hands-on project labs' },
  { icon: 'users', text: 'Google mentorship' },
  { icon: 'megaphone', text: 'Hackathons & tech talks' },
  { icon: 'star', text: 'Certificate & GDG swag' },
];

// Order fields are checked in, so the first invalid one gets focus.
const FIELD_ORDER = ['fullName', 'rollNo', 'mobile', 'email', 'teams', 'graphicsDriveLink'];

const EMPTY_FORM = {
  fullName: '',
  rollNo: '',
  department: 'Computer Engineering',
  year: 'SE',
  mobile: '',
  email: '',
  teams: [],
  graphicsDriveLink: '',
  motivation: ''
};

const inputClass = (invalid) =>
  `w-full min-h-12 rounded-field border bg-surface px-4 text-base text-ink placeholder:text-ink-2/70 transition-colors duration-[var(--dur-fast)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    invalid ? 'border-danger' : 'border-line-strong hover:border-ink-2'
  }`;

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="mt-2 inline-flex items-start gap-1.5 text-sm font-medium text-danger">
      <Icon name="info" className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  ) : null;

/** Text-like input with its label, hint and error wired up for assistive tech. */
const Field = ({ name, label, required, error, hint, children, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-semibold text-ink">
      {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
      {!required && <span className="font-normal text-ink-2">(optional)</span>}
    </label>
    {hint && (
      <p id={`${name}-hint`} className="mt-1 text-sm text-ink-2">
        {hint}
      </p>
    )}
    <div className="mt-2">{children}</div>
    <FieldError id={`${name}-error`} message={error} />
  </div>
);

const describedBy = (name, error, hint) =>
  [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ') || undefined;

const Step = ({ n, title, aside, children }) => (
  <fieldset className="border-t border-line pt-8 first:border-t-0 first:pt-0">
    <legend className="contents">
      <span className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary-tint font-mono text-sm font-semibold text-primary-strong">
            {n}
          </span>
          <span className="text-h3 text-ink">{title}</span>
        </span>
        {aside}
      </span>
    </legend>
    <div className="mt-6">{children}</div>
  </fieldset>
);

const Recruitment = () => {
  usePageMeta('Join', 'Apply to join GDG On Campus Vishwaniketan — five teams, one community. Applications follow the recruitment calendar.');
  const pageRef = useRef(null);
  useReveal(pageRef);
  const formRef = useRef(null);
  const cta = getRecruitmentCta();

  const [formData, setFormData] = useState(EMPTY_FORM);
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

  // Validation rules are unchanged (the backend mirrors them).
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

    // Graphics team poster link is optional — only validate the URL format if one was entered.
    if (formData.teams.includes(GRAPHICS_TEAM_ID) && formData.graphicsDriveLink.trim()) {
      if (!formData.graphicsDriveLink.includes('http')) {
        newErrors.graphicsDriveLink = 'Please enter a valid URL (starting with https://).';
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const focusFirstError = (found) => {
    const first = FIELD_ORDER.find((name) => found[name]);
    const el = first && formRef.current?.querySelector(first === 'teams' ? 'input[name="teams"]' : `#${first}`);
    el?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      focusFirstError(found);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveApplication(formData);
      if (!result?.success || !result.data) throw new Error('Submission failed');
      setSubmittedData(result.data);

      // One celebration, on success only.
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285f4', '#ea4335', '#fbbc05', '#34a853'],
          disableForReducedMotion: true,
        });
      } catch {
        // confetti is decorative
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed:', err);
      setErrors({ form: 'We couldn’t submit your application. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSubmittedData(null);
    setErrors({});
  };

  return (
    <main id="main" ref={pageRef}>
      <PageHeader
        current={`Recruitment ${site.chapterYear}`}
        overline={`Recruitment ${site.chapterYear}`}
        title={
          <>
            Join <span className="text-primary">GDG ViMEET</span>
          </>
        }
        lede="Become part of Vishwaniketan's official Google Developer Groups on Campus. Learn, lead, build high-impact tech, and shape developer culture."
      >
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StatusChip status={cta.open ? 'open' : 'closed'} />
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
          {BENEFITS.map((b) => (
            <li key={b.text} className="inline-flex items-center gap-2">
              <Icon name={b.icon} className="size-4 text-primary" />
              {b.text}
            </li>
          ))}
        </ul>
      </PageHeader>

      <Container className="pb-20 lg:pb-28">
        <div className="max-w-[52rem]">
          {!site.recruitmentOpen ? (
            /* Registrations closed */
            <section aria-labelledby="closed-title" data-reveal className="overflow-hidden rounded-media border border-line bg-surface">
              <ColorStroke className="h-1 w-full rounded-none" />
              <div className="p-8 sm:p-12">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-warning-tint text-ink">
                  <Icon name="lock" className="size-6" />
                </span>
                <h2 id="closed-title" className="mt-5 text-h2 text-ink">
                  Registrations are closed
                </h2>
                <p className="mt-4 max-w-[56ch] text-body-lg text-ink-2">
                  Thanks for your interest in GDG ViMEET! Applications for the {site.chapterYear} recruitment cycle are now closed while our team reviews submissions. Follow us for the next opportunity to join.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={site.social.instagram} icon="external" aria-label="Follow @gdgvimeet on Instagram (opens in a new tab)">
                    <SocialIcon kind="instagram" className="size-4" />
                    Follow @gdgvimeet
                  </Button>
                  <Button to="/" variant="secondary">
                    Back to home
                  </Button>
                </div>
              </div>
            </section>
          ) : submittedData ? (
            /* Submitted */
            <section aria-labelledby="done-title" className="overflow-hidden rounded-media border border-line bg-surface" tabIndex={-1}>
              <span aria-hidden="true" className="color-stroke anim-draw block h-1 w-full origin-left" />
              <div className="p-8 sm:p-12">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-success-tint text-success">
                  <Icon name="check" className="size-6" />
                </span>
                <h2 id="done-title" className="mt-5 text-h2 text-ink" role="status">
                  Application submitted
                </h2>
                <p className="mt-3 text-body-lg text-ink-2">
                  Thank you, <span className="font-semibold text-ink">{submittedData.fullName}</span>. We have received your application for GDG ViMEET.
                </p>

                <dl className="mt-8 grid gap-4 rounded-card bg-surface-2 p-5 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-8">
                  <dt className="text-ink-2">Application ID</dt>
                  <dd className="font-mono font-semibold text-ink">{submittedData.id}</dd>
                  <dt className="text-ink-2">Department &amp; year</dt>
                  <dd className="text-ink">
                    {submittedData.department} ({submittedData.year})
                  </dd>
                  <dt className="text-ink-2">Teams</dt>
                  <dd className="text-ink">{(submittedData.teams || []).join(', ')}</dd>
                  {submittedData.graphicsDriveLink && (
                    <>
                      <dt className="text-ink-2">Poster link</dt>
                      <dd>
                        <a href={submittedData.graphicsDriveLink} target="_blank" rel="noopener noreferrer" className="break-all text-primary hover:underline">
                          {submittedData.graphicsDriveLink}
                        </a>
                      </dd>
                    </>
                  )}
                </dl>

                <h3 className="mt-8 font-semibold text-ink">Next steps</h3>
                <ul className="mt-3 space-y-2 text-ink-2">
                  <li className="flex gap-3"><Icon name="check" className="mt-1 size-4 shrink-0 text-success" />Our team will review your application and portfolio/poster submissions.</li>
                  <li className="flex gap-3"><Icon name="check" className="mt-1 size-4 shrink-0 text-success" />Shortlisted students will receive an email/WhatsApp update for the interview round.</li>
                  <li className="flex gap-3"><Icon name="check" className="mt-1 size-4 shrink-0 text-success" />Follow our official Instagram @gdgvimeet for announcements.</li>
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to="/">Back to home</Button>
                  <Button variant="secondary" onClick={resetForm}>
                    Submit another response
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            /* Application form */
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8 rounded-media border border-line bg-surface p-6 sm:p-10">
              {errors.form && (
                <div role="alert" className="flex items-start gap-3 rounded-card bg-danger-tint p-4 text-sm font-medium text-danger">
                  <Icon name="info" className="mt-0.5 size-5 shrink-0" />
                  {errors.form}
                </div>
              )}

              <Step n={1} title="Student details">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field name="fullName" label="Full name" required error={errors.fullName}>
                    <input id="fullName" name="fullName" type="text" autoComplete="name" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Rahul Sharma" aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy('fullName', errors.fullName)} className={inputClass(errors.fullName)} />
                  </Field>
                  <Field name="rollNo" label="Roll number" required error={errors.rollNo}>
                    <input id="rollNo" name="rollNo" type="text" value={formData.rollNo} onChange={handleInputChange} placeholder="e.g. 23CE045" aria-invalid={Boolean(errors.rollNo)} aria-describedby={describedBy('rollNo', errors.rollNo)} className={inputClass(errors.rollNo)} />
                  </Field>
                  <Field name="department" label="Department / branch" required>
                    <div className="relative">
                      <select id="department" name="department" value={formData.department} onChange={handleInputChange} className={`${inputClass(false)} appearance-none pr-11`}>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <Icon name="chevron-down" className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-2" />
                    </div>
                  </Field>
                  <fieldset>
                    <legend className="block text-sm font-semibold text-ink">
                      Year of study <span className="text-danger" aria-hidden="true">*</span>
                    </legend>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {YEARS.map((yr) => (
                        <label key={yr} className="relative">
                          <input type="radio" name="year" value={yr} checked={formData.year === yr} onChange={handleInputChange} className="peer sr-only" />
                          <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-field border border-line-strong font-semibold text-ink-2 transition-colors hover:border-ink-2 peer-checked:border-primary peer-checked:bg-primary-tint peer-checked:text-primary-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                            {yr}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <Field name="mobile" label="WhatsApp / mobile number" required error={errors.mobile}>
                    <div className="relative">
                      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ink-2">+91</span>
                      <input id="mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" value={formData.mobile} onChange={handleInputChange} placeholder="9876543210" maxLength={10} aria-invalid={Boolean(errors.mobile)} aria-describedby={describedBy('mobile', errors.mobile)} className={`${inputClass(errors.mobile)} pl-14 font-mono`} />
                    </div>
                  </Field>
                  <Field name="email" label="Email address" required error={errors.email}>
                    <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} placeholder="student@vimeet.ac.in" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email', errors.email)} className={inputClass(errors.email)} />
                  </Field>
                </div>
              </Step>

              <Step
                n={2}
                title="Teams you want to join"
                aside={
                  <span className="text-sm text-ink-2" aria-live="polite">
                    {formData.teams.length ? `${formData.teams.length} selected` : 'Choose one or more'}
                  </span>
                }
              >
                <div role="group" aria-labelledby="teams-hint" aria-describedby={errors.teams ? 'teams-error' : undefined}>
                  <p id="teams-hint" className="mb-4 text-sm text-ink-2">
                    You can select more than one team if you are interested in multiple domains.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {recruitmentTeams.map((team) => {
                      const checked = formData.teams.includes(team.id);
                      return (
                        <label key={team.id} className="relative block cursor-pointer">
                          <input type="checkbox" name="teams" value={team.id} checked={checked} onChange={() => toggleTeam(team.id)} aria-invalid={Boolean(errors.teams)} className="peer sr-only" />
                          <span className="flex h-full gap-4 rounded-card border border-line-strong p-4 transition-[border-color,background-color,box-shadow] hover:border-ink-2 peer-checked:border-primary peer-checked:bg-primary-tint/50 peer-checked:shadow-rest peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-2">
                              <Icon name={TEAM_ICON[team.iconKey] ?? 'users'} className="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold text-ink">{team.name}</span>
                              <span className="block text-xs font-medium uppercase tracking-[0.06em] text-ink-2">{team.badge}</span>
                              <span className="mt-2 block text-sm text-ink-2">{team.description}</span>
                            </span>
                            <span aria-hidden="true" className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md border ${checked ? 'border-primary bg-primary text-white' : 'border-line-strong bg-surface'}`}>
                              {checked && <Icon name="check" className="size-4" />}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="teams-error" message={errors.teams} />
                </div>

                {formData.teams.includes(GRAPHICS_TEAM_ID) && (
                  <div className="mt-6 rounded-card border border-line bg-surface-2 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-ink">Graphics & Design team challenge</h3>
                      <span className="rounded-full bg-warning-tint px-3 py-1 text-xs font-semibold text-ink">Optional · bonus points</span>
                    </div>
                    <p className="mt-3 text-sm text-ink-2">
                      Want to stand out? Design an original <strong className="text-ink">Ganesh Chaturthi poster</strong> and share it below — it’s optional, but it helps us see your work.
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-2">
                      <li>You may use Photoshop, Illustrator, Figma, or Canva.</li>
                      <li>Export your poster as JPG/PNG or PDF and upload it to your Google Drive.</li>
                      <li>
                        <strong className="text-ink">Important:</strong> set sharing to “Anyone with the link can view” so our panel can open it.
                      </li>
                    </ul>
                    <Field name="graphicsDriveLink" label="Google Drive link to your poster" error={errors.graphicsDriveLink} className="mt-5">
                      <input id="graphicsDriveLink" name="graphicsDriveLink" type="url" value={formData.graphicsDriveLink} onChange={handleInputChange} placeholder="https://drive.google.com/file/d/…" aria-invalid={Boolean(errors.graphicsDriveLink)} aria-describedby={describedBy('graphicsDriveLink', errors.graphicsDriveLink)} className={`${inputClass(errors.graphicsDriveLink)} font-mono text-sm`} />
                    </Field>
                  </div>
                )}
              </Step>

              <Step n={3} title="Why GDG ViMEET?">
                <Field name="motivation" label="Tell us about yourself" hint="Past experience, projects, or why you would love to be part of GDG ViMEET — include your GitHub, LinkedIn or portfolio link if you have one.">
                  <textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleInputChange} rows={4} aria-describedby="motivation-hint" className={`${inputClass(false)} min-h-32 py-3`} />
                </Field>
              </Step>

              <div className="flex flex-col-reverse items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ink-2">By submitting, you agree to receive interview updates on WhatsApp and email.</p>
                <Button type="submit" disabled={isSubmitting} icon={isSubmitting ? undefined : 'arrow-right'} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting…
                    </>
                  ) : (
                    'Submit application'
                  )}
                </Button>
              </div>
            </form>
          )}

          <p className="mt-8 text-sm text-ink-2">
            Are you a GDG core member?{' '}
            <Link to="/admin/applications" className="font-medium text-primary hover:underline">
              View the applicant dashboard
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
};

export default Recruitment;
