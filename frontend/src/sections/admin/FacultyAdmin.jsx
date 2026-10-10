import { useEffect, useState } from 'react';
import { getAdminFaculty, createFacultyMember, updateFacultyMember, deleteFacultyMember } from '../../services/adminFaculty';

const FacultyAdmin = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    orderIndex: 0,
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminFaculty();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError('Could not load faculty members.');
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
      name: '',
      role: '',
      orderIndex: members.length > 0 ? members[members.length - 1].orderIndex + 1 : 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      orderIndex: member.orderIndex || 0,
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
      const payload = {
        name: formData.name,
        role: formData.role,
        orderIndex: Number(formData.orderIndex),
      };

      if (editingId) {
        await updateFacultyMember(editingId, payload);
      } else {
        await createFacultyMember(payload);
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
    if(!window.confirm('Are you sure you want to delete this faculty member?')) return;
    setBusy(true);
    try {
      await deleteFacultyMember(id);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Faculty Guidance</h1>
          <p className="text-sm text-ink-2 mt-1">Manage the faculty members displayed in the Team section.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-strong transition"
        >
          + Add Faculty
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
          <p className="text-ink-2 text-sm">Loading faculty members…</p>
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-line-strong bg-surface">
          <p className="text-ink text-lg font-semibold mb-1">No faculty yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface divide-y divide-line overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-ink-2">
              <tr>
                <th className="px-4 py-3 font-medium w-16 text-center">Order</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map(member => (
                <tr key={member._id} className="hover:bg-surface-2/50 transition">
                  <td className="px-4 py-3 text-ink-2 text-center">{member.orderIndex}</td>
                  <td className="px-4 py-3 font-medium text-ink">{member.name}</td>
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
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-line flex justify-between items-center">
              <h2 className="text-xl font-bold text-ink">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h2>
              <button onClick={closeModal} className="text-ink-2 hover:text-ink">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="Dr. B. R. Patil" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Role</label>
                <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" placeholder="Principal of ViMEET" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Order Index (Sort)</label>
                <input type="number" value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: e.target.value})} className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-line hover:bg-surface-2 transition">Cancel</button>
                <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-strong transition disabled:opacity-50">
                  {busy ? 'Saving...' : 'Save Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAdmin;
