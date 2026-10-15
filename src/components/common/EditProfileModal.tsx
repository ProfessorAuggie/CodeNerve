import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  GraduationCap, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ShieldCheck, 
  Hash, 
  Activity, 
  Sparkles 
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import type { StudentRecord, ApprovalStatus } from '../../types';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'student-self' | 'admin-self' | 'admin-student';
  student?: StudentRecord | null;
  onSuccess?: (message: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  mode,
  student,
  onSuccess,
}) => {
  const { user, updateUserProfile, updateStudentByAdmin } = useUserStore();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState<number>(3);
  const [track, setTrack] = useState<'lpu' | 'global'>('lpu');
  const [batch, setBatch] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('approved');
  const [studentStatus, setStudentStatus] = useState<'online' | 'idle' | 'offline'>('online');
  const [currentActivity, setCurrentActivity] = useState('');
  
  // UI Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form state depending on mode
  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);

    if (mode === 'admin-student' && student) {
      setName(student.name || '');
      setEmail(student.email || '');
      setRegistrationNumber(student.registrationNumber || '');
      setTrack(student.track || 'lpu');
      setBatch(student.batch || '');
      setApprovalStatus(student.approvalStatus || 'approved');
      setStudentStatus(student.status || 'online');
      setCurrentActivity(student.currentActivity || '');
      setUniversity(student.track === 'lpu' ? 'Lovely Professional University (LPU)' : 'Global Student Cohort');
      setSemester(3);
    } else if (mode === 'admin-self') {
      setName(user.name || 'Dr. Auggie');
      setEmail(user.email || 'faculty.cse@lpu.in');
      setRegistrationNumber(user.registrationNumber || 'FAC-1001');
      setUniversity(user.university || 'Lovely Professional University (LPU)');
      setBatch(user.batch || 'Head of CSE Faculty');
      setTrack('lpu');
    } else {
      // student-self
      setName(user.name || '');
      setEmail(user.email || '');
      setRegistrationNumber(user.registrationNumber || '');
      setUniversity(user.university || 'Lovely Professional University (LPU)');
      setSemester(user.semester || 3);
      setTrack(user.track || 'lpu');
      setBatch(user.batch || 'LPU B.Tech CSE (CSE202/205)');
    }
  }, [isOpen, mode, student, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        if (mode === 'admin-student' && student) {
          updateStudentByAdmin(student.id, {
            name: name.trim(),
            email: email.trim(),
            registrationNumber: registrationNumber.trim(),
            track,
            batch: batch.trim(),
            approvalStatus,
            status: studentStatus,
            currentActivity: currentActivity.trim() || student.currentActivity,
          });
          onSuccess?.(`Student profile for "${name.trim()}" successfully updated.`);
        } else if (mode === 'admin-self') {
          updateUserProfile({
            name: name.trim(),
            email: email.trim(),
            registrationNumber: registrationNumber.trim(),
            university: university.trim(),
            batch: batch.trim(),
          });
          onSuccess?.('Admin faculty profile successfully updated.');
        } else {
          // student-self
          updateUserProfile({
            name: name.trim(),
            email: email.trim(),
            registrationNumber: registrationNumber.trim(),
            university: university.trim(),
            semester,
            track,
            batch: batch.trim(),
          });
          onSuccess?.('Your student profile was successfully updated.');
        }

        setIsSubmitting(false);
        onClose();
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('An error occurred while saving profile changes.');
      }
    }, 200);
  };

  const getInitials = (str: string) => {
    return str
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg ${
            mode === 'admin-self'
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/25'
              : mode === 'admin-student'
              ? 'bg-gradient-to-tr from-brand-600 to-emerald-600 shadow-emerald-500/25'
              : 'bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 shadow-brand-500/25'
          }`}>
            {getInitials(name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {mode === 'admin-self'
                  ? 'Edit Admin Profile'
                  : mode === 'admin-student'
                  ? `Edit Student: ${student?.name || 'Record'}`
                  : 'Edit Your Profile'}
              </h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                mode === 'admin-self'
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40'
                  : 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-500/30'
              }`}>
                {mode === 'admin-self' ? 'Admin' : mode === 'admin-student' ? 'Roster Edit' : 'Student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mode === 'admin-self'
                ? 'Update your faculty credentials, designation, and contact details'
                : mode === 'admin-student'
                ? 'Modify academic batch, approval status, and tracking information'
                : 'Keep your academic profile and cohort details up to date'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {mode === 'admin-self' ? 'Faculty Email Address' : 'Student Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@lpu.in"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Registration Number & Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {mode === 'admin-self' ? 'Faculty ID' : 'Registration Number / ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. 12104921"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {mode === 'admin-self' ? 'Designation / Department' : 'Batch / Section'}
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder={mode === 'admin-self' ? 'Head of CSE Faculty' : 'LPU B.Tech CSE (CSE202/205)'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Track Selection (for student modes) */}
          {mode !== 'admin-self' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Curriculum Track
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTrack('lpu')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition ${
                    track === 'lpu'
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div>LPU University</div>
                    <div className="text-[10px] font-normal text-slate-500">CSE202 / CSE205 C++</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTrack('global')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition ${
                    track === 'global'
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/30 text-brand-900 dark:text-brand-100 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Globe className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <div>
                    <div>Global DSA</div>
                    <div className="text-[10px] font-normal text-slate-500">Public DSA 130 Sheet</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* University & Semester (for student-self) */}
          {mode === 'student-self' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  University / Institute
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Lovely Professional University (LPU)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s} (Year {Math.ceil(s / 2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Admin editing student: Approval Status & Real-Time Status */}
          {mode === 'admin-student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Approval Status
                </label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value as ApprovalStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                >
                  <option value="approved">Approved (Full Access)</option>
                  <option value="pending">Pending Review (Sign-in Blocked)</option>
                  <option value="disapproved">Disapproved / Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Presence Status
                </label>
                <select
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value as 'online' | 'idle' | 'offline')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                >
                  <option value="online">Online (Active)</option>
                  <option value="idle">Idle</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          )}

          {/* Admin editing student: Activity Note */}
          {mode === 'admin-student' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                <span>Current Real-Time Activity Note</span>
              </label>
              <input
                type="text"
                value={currentActivity}
                onChange={(e) => setCurrentActivity(e.target.value)}
                placeholder="e.g. Practicing: CSE205 Binary Search Trees"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          )}

          {/* University affiliation for Admin */}
          {mode === 'admin-self' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                University / Institution
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Lovely Professional University (LPU)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg transition cursor-pointer disabled:opacity-50 ${
                mode === 'admin-self'
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'
                  : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
