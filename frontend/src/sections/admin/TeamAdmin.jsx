import { useEffect, useState } from 'react';
import { getAdminTeams, createTeamMember, updateTeamMember, deleteTeamMember } from '../../services/adminTeams';

const TeamAdmin = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const [formData, setFormData] = useState({
    teamName: '',
    name: '',
    role: '',
    orderIndex: 0,
    socialLinkedIn: '',
    socialInstagram: '',
    socialGitHub: '',
    socialEmail: '',
    socialPortfolio: '',
    showOnHomepage: false
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminTeams();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError('Could not load team members.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      teamName: 'CORE TEAM 2025-26', // default value
      name: '',
      role: 'Member',
      orderIndex: 0,
      socialLinkedIn: '',
      socialInstagram: '',
      socialGitHub: '',
      socialEmail: '',
      socialPortfolio: '',
      showOnHomepage: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    const getSocial = (label) => member.socials?.find(s => s.label.toLowerCase() === label.toLowerCase())?.href || '';
    setFormData({
      teamName: member.teamName || '',
      name: member.name || '',
      role: member.role || '',
      orderIndex: member.orderIndex || 0,
      socialLinkedIn: getSocial('LinkedIn'),
      socialInstagram: getSocial('Instagram'),
      socialGitHub: getSocial('GitHub'),
      socialEmail: getSocial('Email'),
      socialPortfolio: getSocial('Portfolio'),
      showOnHomepage: member.showOnHomepage || false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const getValidUrl = (url, label) => {
        if (!url) return '';
        if (label.toLowerCase() === 'email') return url.startsWith('mailto:') ? url : `mailto:${url}`;
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) return `https://${url}`;
        return url;
      };

      const parsedSocials = [];
      if (formData.socialLinkedIn) parsedSocials.push({ label: 'LinkedIn', href: getValidUrl(formData.socialLinkedIn, 'LinkedIn') });
      if (formData.socialInstagram) parsedSocials.push({ label: 'Instagram', href: getValidUrl(formData.socialInstagram, 'Instagram') });
      if (formData.socialGitHub) parsedSocials.push({ label: 'GitHub', href: getValidUrl(formData.socialGitHub, 'GitHub') });
      if (formData.socialPortfolio) parsedSocials.push({ label: 'Portfolio', href: getValidUrl(formData.socialPortfolio, 'Portfolio') });
      if (formData.socialEmail) {
        const href = formData.socialEmail.includes('@') && !formData.socialEmail.startsWith('mailto:') && !formData.socialEmail.startsWith('http') 
          ? `mailto:${formData.socialEmail}` 
          : formData.socialEmail;
        parsedSocials.push({ label: 'Email', href });
      }

      const payload = {
        teamName: formData.teamName,
        name: formData.name,
        role: formData.role,
        socials: parsedSocials,
        orderIndex: Number(formData.orderIndex),
        showOnHomepage: formData.showOnHomepage
      };

      if (editingId) {
        await updateTeamMember(editingId, payload);
      } else {
        await createTeamMember(payload);
      }
      
      closeModal();
      load(); // reload the list
    } catch (err) {
      setError(err.message || 'Error saving member');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this member?')) return;
    setBusy(true);
    try {
      await deleteTeamMember(id);
      load();
    } catch {
      setError('Could not delete member.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Core Team Members</h1>
          <p className="text-sm text-ink-2 mt-1">Manage the people displayed in the Team section.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-strong transition"
        >
          + Add Member
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-danger/30 bg-danger-tint text-danger text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 rounded-2xl border border-line bg-surface">
          <span className="inline-block size-6 rounded-full border-2 border-line-strong border-t-primary animate-spin mb-3" />
          <p className="text-ink-2 text-sm">Loading team members…</p>
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-line-strong bg-surface">
          <p className="text-ink text-lg font-semibold mb-1">No members yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface divide-y divide-line overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-ink-2">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map(member => (
                <tr key={member._id} className="hover:bg-surface-2/50 transition">
                  <td className="px-4 py-3 font-medium text-ink">{member.name}</td>
                  <td className="px-4 py-3 text-ink-2">{member.teamName}</td>
                  <td className="px-4 py-3 text-ink-2">{member.role}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(member)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member._id)}
                      className="text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-line flex justify-between items-center">
              <h2 className="text-xl font-bold text-ink">{editingId ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={closeModal} className="text-ink-2 hover:text-ink">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Team Name</label>
                  <select required value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink">
                    <option value="" disabled>Select a team</option>
                    <option value="CORE TEAM 2025-26">CORE TEAM 2025-26</option>
                    <option value="Web-Dev Team">Web-Dev Team</option>
                    <option value="Technical Team">Technical Team</option>
                    <option value="Graphics & Design Team">Graphics & Design Team</option>
                    <option value="Content & Social Media Team">Content & Social Media Team</option>
                    <option value="PR & Outreach Team">PR & Outreach Team</option>
                    <option value="Event Management Team">Event Management Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Role / Post</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="Lead, Co-Head, Member" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Order Index (Sort)</label>
                  <input type="number" value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">LinkedIn URL</label>
                  <input value={formData.socialLinkedIn} onChange={e => setFormData({...formData, socialLinkedIn: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Instagram URL</label>
                  <input value={formData.socialInstagram} onChange={e => setFormData({...formData, socialInstagram: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">GitHub URL</label>
                  <input value={formData.socialGitHub} onChange={e => setFormData({...formData, socialGitHub: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Email</label>
                  <input value={formData.socialEmail} onChange={e => setFormData({...formData, socialEmail: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="example@gmail.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Portfolio / Website URL</label>
                <input value={formData.socialPortfolio} onChange={e => setFormData({...formData, socialPortfolio: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="https://my-portfolio.com" />
              </div>

              <div className="flex items-center gap-3 pt-2 pb-2">
                <input 
                  type="checkbox" 
                  id="showOnHomepage" 
                  checked={formData.showOnHomepage} 
                  onChange={e => setFormData({...formData, showOnHomepage: e.target.checked})} 
                  className="size-4 rounded border-line" 
                />
                <label htmlFor="showOnHomepage" className="text-sm font-medium text-ink cursor-pointer">
                  Show in "The people behind it" section on Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-line hover:bg-surface-2 transition">Cancel</button>
                <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-strong transition disabled:opacity-50">
                  {busy ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;
