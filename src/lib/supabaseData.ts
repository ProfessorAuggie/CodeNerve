import type { ProblemProgress, ProblemStatus, StudentRecord, UserProfile } from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

export interface RemoteStudentProfile extends UserProfile {
  approvalStatus: NonNullable<UserProfile['approvalStatus']>;
}

const studentRecordFromProfile = (row: Record<string, unknown>): StudentRecord => ({
  id: String(row.id),
  name: String(row.name ?? ''),
  email: String(row.email ?? ''),
  registrationNumber: String(row.registration_number ?? ''),
  avatar: row.avatar ? String(row.avatar) : undefined,
  university: String(row.university ?? 'CodeNerve Explorer'),
  semester: Number(row.semester ?? 1),
  track: row.track === 'lpu' ? 'lpu' : 'global',
  batch: String(row.batch ?? 'Independent Study'),
  joinedAt: String(row.created_at ?? new Date().toISOString()),
  status: 'offline',
  currentActivity: 'Registered learner',
  lastActive: String(row.updated_at ?? row.created_at ?? ''),
  solvedProblemIds: [],
  totalSolved: 0,
  completedLessons: [],
  quizScores: {},
  approvalStatus: (row.approval_status as StudentRecord['approvalStatus']) ?? 'pending',
});

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

const profileFromRow = (row: Record<string, unknown>): RemoteStudentProfile => ({
  id: String(row.id),
  name: String(row.name ?? ''),
  email: String(row.email ?? ''),
  role: (row.role as UserProfile['role']) ?? 'student',
  university: String(row.university ?? 'CodeNerve Explorer'),
  semester: Number(row.semester ?? 1),
  registrationNumber: row.registration_number ? String(row.registration_number) : undefined,
  batch: row.batch ? String(row.batch) : undefined,
  track: row.track === 'lpu' ? 'lpu' : 'global',
  avatar: row.avatar ? String(row.avatar) : undefined,
  approvalStatus: (row.approval_status as RemoteStudentProfile['approvalStatus']) ?? 'pending',
});

export async function signInStudent(identifier: string, password: string) {
  const client = requireSupabase();
  const cleanIdentifier = identifier.trim();
  if (!cleanIdentifier || !password) {
    return { success: false, message: 'Enter your email or registration number and password.' };
  }

  let email = cleanIdentifier;
  if (!cleanIdentifier.includes('@')) {
    const { data, error } = await client
      .from('profiles')
      .select('email')
      .eq('registration_number', cleanIdentifier)
      .maybeSingle();
    if (error) throw error;
    if (!data?.email) {
      return { success: false, message: 'No student record found for that registration number.' };
    }
    email = data.email;
  }

  const { data: authData, error: authError } = await client.auth.signInWithPassword({ email, password });
  if (authError) {
    return { success: false, message: authError.message };
  }
  if (!authData.user) {
    return { success: false, message: 'Authentication did not return a user session.' };
  }

  const { data: profileRow, error: profileError } = await client
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();
  if (profileError) {
    await client.auth.signOut();
    throw profileError;
  }

  const profile = profileFromRow(profileRow);
  if (profile.approvalStatus !== 'approved') {
    await client.auth.signOut();
    const statusText = profile.approvalStatus === 'pending' ? 'PENDING administrator approval' : 'DISAPPROVED by the administrator';
    return { success: false, message: `Your registration is ${statusText}.` };
  }

  return { success: true, message: `Welcome back, ${profile.name}!`, profile };
}

export async function signInAdmin(email: string, password: string) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return { success: false, message: error.message };
  if (!data.user) return { success: false, message: 'Authentication did not return a user session.' };

  const { data: row, error: profileError } = await client
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  if (profileError) {
    await client.auth.signOut();
    throw profileError;
  }
  if (row.role !== 'admin' && row.role !== 'teacher') {
    await client.auth.signOut();
    return { success: false, message: 'This account does not have faculty administrator access.' };
  }

  return { success: true, message: `Welcome, ${row.name}.`, profile: profileFromRow(row) };
}

export async function loadAdminRoster(): Promise<StudentRecord[]> {
  const client = requireSupabase();
  const [{ data: profiles, error: profilesError }, { data: progress, error: progressError }, { data: lessons, error: lessonsError }, { data: quizzes, error: quizzesError }] =
    await Promise.all([
      client.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }),
      client.from('problem_progress').select('user_id, problem_id, status').eq('status', 'SOLVED'),
      client.from('lesson_progress').select('user_id, lesson_id').eq('completed', true),
      client.from('quiz_scores').select('user_id, quiz_id, score, total, completed_at'),
    ]);
  if (profilesError) throw profilesError;
  if (progressError) throw progressError;
  if (lessonsError) throw lessonsError;
  if (quizzesError) throw quizzesError;

  const solvedByUser = new Map<string, string[]>();
  for (const row of progress ?? []) {
    solvedByUser.set(row.user_id, [...(solvedByUser.get(row.user_id) ?? []), row.problem_id]);
  }
  const lessonsByUser = new Map<string, string[]>();
  for (const row of lessons ?? []) {
    lessonsByUser.set(row.user_id, [...(lessonsByUser.get(row.user_id) ?? []), row.lesson_id]);
  }
  const quizzesByUser = new Map<string, StudentRecord['quizScores']>();
  for (const row of quizzes ?? []) {
    quizzesByUser.set(row.user_id, {
      ...(quizzesByUser.get(row.user_id) ?? {}),
      [row.quiz_id]: { score: row.score, total: row.total, date: row.completed_at },
    });
  }

  return (profiles ?? []).map((row) => {
    const student = studentRecordFromProfile(row);
    const solvedProblemIds = solvedByUser.get(student.id) ?? [];
    return {
      ...student,
      solvedProblemIds,
      totalSolved: solvedProblemIds.length,
      completedLessons: lessonsByUser.get(student.id) ?? [],
      quizScores: quizzesByUser.get(student.id) ?? {},
    };
  });
}

export async function updateStudentApproval(studentId: string, approvalStatus: NonNullable<UserProfile['approvalStatus']>) {
  const { error } = await requireSupabase()
    .from('profiles')
    .update({ approval_status: approvalStatus, updated_at: new Date().toISOString() })
    .eq('id', studentId)
    .eq('role', 'student');
  if (error) throw error;
}

export async function registerStudentRemote(input: {
  name: string;
  email: string;
  password: string;
  registrationNumber: string;
  batch: string;
  track: 'global' | 'lpu';
}) {
  const client = requireSupabase();
  const { data: authData, error: authError } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        registration_number: input.registrationNumber,
        batch: input.batch,
        track: input.track,
      },
    },
  });
  if (authError) throw authError;
  if (!authData.user) throw new Error('Registration did not return an authenticated user.');

  const { error: profileError } = await client.from('profiles').upsert({
    id: authData.user.id,
    name: input.name,
    email: input.email,
    registration_number: input.registrationNumber,
    batch: input.batch,
    track: input.track,
    role: 'student',
    approval_status: 'pending',
  });
  if (profileError) throw profileError;

  await client.auth.signOut();
  return { name: input.name };
}

export async function loadStudentData(userId: string) {
  const client = requireSupabase();
  const [{ data: progress, error: progressError }, { data: bookmarks, error: bookmarksError }, { data: lessons, error: lessonsError }, { data: quizzes, error: quizzesError }] =
    await Promise.all([
      client.from('problem_progress').select('*').eq('user_id', userId),
      client.from('problem_bookmarks').select('problem_id').eq('user_id', userId),
      client.from('lesson_progress').select('lesson_id').eq('user_id', userId).eq('completed', true),
      client.from('quiz_scores').select('*').eq('user_id', userId),
    ]);
  if (progressError) throw progressError;
  if (bookmarksError) throw bookmarksError;
  if (lessonsError) throw lessonsError;
  if (quizzesError) throw quizzesError;

  return {
    problemProgress: Object.fromEntries((progress ?? []).map((row) => [row.problem_id, {
      problemId: row.problem_id,
      status: row.status as ProblemStatus,
      firstAttempted: row.first_attempted,
      solvedAt: row.solved_at,
      lastUpdated: row.updated_at,
      notes: row.notes,
      submissionUrl: row.submission_url,
    } satisfies ProblemProgress])),
    bookmarks: (bookmarks ?? []).map((row) => row.problem_id),
    completedLessons: (lessons ?? []).map((row) => row.lesson_id),
    quizScores: Object.fromEntries((quizzes ?? []).map((row) => [row.quiz_id, {
      score: row.score,
      total: row.total,
      date: row.completed_at,
    }])),
  };
}

export async function saveProblemProgress(userId: string, progress: ProblemProgress) {
  const client = requireSupabase();
  const { error } = await client.from('problem_progress').upsert({
    user_id: userId,
    problem_id: progress.problemId,
    status: progress.status,
    first_attempted: progress.firstAttempted,
    solved_at: progress.solvedAt,
    notes: progress.notes,
    submission_url: progress.submissionUrl,
    updated_at: progress.lastUpdated,
  });
  if (error) throw error;
}

export async function setBookmark(userId: string, problemId: string, bookmarked: boolean) {
  const client = requireSupabase();
  const result = bookmarked
    ? await client.from('problem_bookmarks').upsert({ user_id: userId, problem_id: problemId })
    : await client.from('problem_bookmarks').delete().eq('user_id', userId).eq('problem_id', problemId);
  if (result.error) throw result.error;
}

export async function setLessonCompletion(userId: string, lessonId: string, completed: boolean) {
  const client = requireSupabase();
  const result = completed
    ? await client.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId, completed: true })
    : await client.from('lesson_progress').delete().eq('user_id', userId).eq('lesson_id', lessonId);
  if (result.error) throw result.error;
}

export async function saveQuizScore(userId: string, quizId: string, score: number, total: number) {
  const { error } = await requireSupabase().from('quiz_scores').upsert({ user_id: userId, quiz_id: quizId, score, total });
  if (error) throw error;
}
