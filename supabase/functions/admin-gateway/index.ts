import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const encode = (value: unknown) => btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

const signToken = async () => {
  const header = encode({ alg: 'HS256', typ: 'CN_ADMIN' });
  const payload = encode({ exp: Math.floor(Date.now() / 1000) + 3600 });
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('ADMIN_GATEWAY_SECRET')!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${payload}`));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  return `${header}.${payload}.${encodedSignature}`;
};

const isValidToken = async (token: string) => {
  try {
    const [header, payload, signature] = token.split('.');
    const parsedPayload = JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')));
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('ADMIN_GATEWAY_SECRET')!),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const normalizedSignature = signature.replaceAll('-', '+').replaceAll('_', '/');
    const bytes = Uint8Array.from(atob(normalizedSignature), (character) => character.charCodeAt(0));
    return Number(parsedPayload.exp) > Math.floor(Date.now() / 1000)
      && await crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(`${header}.${payload}`));
  } catch {
    return false;
  }
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await request.json();
    const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    if (body.action === 'login') {
      if (!body.password || body.password !== Deno.env.get('ADMIN_PASSWORD')) return json({ message: 'Invalid administrator password.' }, 401);
      const { data: profile, error } = await service.from('profiles').select('*').eq('email', Deno.env.get('ADMIN_EMAIL')).single();
      if (error) throw error;
      if (profile.role !== 'admin' && profile.role !== 'teacher') return json({ message: 'Administrator profile is not enabled.' }, 403);
      return json({ token: await signToken(), profile });
    }

    if (!body.token || !await isValidToken(body.token)) return json({ message: 'Administrator session expired.' }, 401);
    if (body.action === 'approval') {
      const { error } = await service.from('profiles').update({ approval_status: body.approvalStatus, updated_at: new Date().toISOString() }).eq('id', body.studentId).eq('role', 'student');
      if (error) throw error;
      return json({ ok: true });
    }
    if (body.action === 'roster') {
      const [{ data: profiles, error: profilesError }, { data: progress, error: progressError }] = await Promise.all([
        service.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }),
        service.from('problem_progress').select('user_id, problem_id').eq('status', 'SOLVED'),
      ]);
      if (profilesError) throw profilesError;
      if (progressError) throw progressError;
      const solved = new Map<string, string[]>();
      for (const row of progress ?? []) solved.set(row.user_id, [...(solved.get(row.user_id) ?? []), row.problem_id]);
      return json({ students: (profiles ?? []).map((profile) => {
        const solvedProblemIds = solved.get(profile.id) ?? [];
        return { id: profile.id, name: profile.name, email: profile.email, registrationNumber: profile.registration_number ?? '', university: profile.university, semester: profile.semester, track: profile.track, batch: profile.batch ?? 'Independent Study', joinedAt: profile.created_at, status: 'offline', currentActivity: 'Registered learner', lastActive: profile.updated_at, solvedProblemIds, totalSolved: solvedProblemIds.length, completedLessons: [], quizScores: {}, approvalStatus: profile.approval_status };
      }) });
    }
    return json({ message: 'Unknown admin action.' }, 400);
  } catch (error) {
    console.error(error);
    return json({ message: 'Administrator gateway request failed.' }, 500);
  }
});
