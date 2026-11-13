import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'writer' | 'reader';
  isDefaultAdmin?: boolean;
  avatar?: string;
  createdAt?: string;
}

const DEFAULT_ADMIN_EMAIL = 'akramyoonos006@gmail.com';

// Initial seed list matching the reference design
const SEED_USERS: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Akram Yoonos',
    email: 'Akramyoonos1999@gmail.com',
    role: 'writer',
    createdAt: '2026-11-01',
  },
  {
    id: 'u-2',
    name: 'Mohamed Azmy Mohamed Akram',
    email: 'akramyoonos006@gmail.com',
    role: 'admin',
    isDefaultAdmin: true,
    createdAt: '2026-10-15',
  },
  {
    id: 'u-3',
    name: 'Ronda B',
    email: 'ronda9997@gmail.com',
    role: 'writer',
    createdAt: '2026-11-03',
  },
  {
    id: 'u-4',
    name: 'Samra Admin',
    email: 'fathimasamra200305@gmail.com',
    role: 'admin',
    createdAt: '2026-10-10',
  },
  {
    id: 'u-5',
    name: 'Dylan Candice Odulio',
    email: 'dylan.odulio@globaltimes.com',
    role: 'writer',
    createdAt: '2026-10-22',
  },
  {
    id: 'u-6',
    name: 'Elena Rostova',
    email: 'elena.rostova@globaltimes.com',
    role: 'admin',
    createdAt: '2026-10-12',
  },
  {
    id: 'u-7',
    name: 'Marcus Vance',
    email: 'marcus.vance@globaltimes.com',
    role: 'admin',
    createdAt: '2026-10-14',
  },
  {
    id: 'u-8',
    name: 'Sophia Sterling',
    email: 'sophia.sterling@globaltimes.com',
    role: 'admin',
    createdAt: '2026-10-16',
  },
  {
    id: 'u-9',
    name: 'David Chen',
    email: 'david.chen@globaltimes.com',
    role: 'admin',
    createdAt: '2026-10-18',
  },
  {
    id: 'u-10',
    name: 'Rachel Adams',
    email: 'rachel.adams@globaltimes.com',
    role: 'admin',
    createdAt: '2026-10-19',
  },
  {
    id: 'u-11',
    name: 'Thomas Wright',
    email: 'thomas.wright@globaltimes.com',
    role: 'admin',
    createdAt: '2026-10-20',
  },
  {
    id: 'u-12',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@press.com',
    role: 'writer',
    createdAt: '2026-10-25',
  },
  {
    id: 'u-13',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@press.com',
    role: 'writer',
    createdAt: '2026-10-26',
  },
  {
    id: 'u-14',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.mansoor@press.com',
    role: 'writer',
    createdAt: '2026-10-27',
  },
  {
    id: 'u-15',
    name: 'James O’Connor',
    email: 'james.oconnor@press.com',
    role: 'writer',
    createdAt: '2026-10-28',
  },
  {
    id: 'u-16',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@press.com',
    role: 'writer',
    createdAt: '2026-10-29',
  },
  {
    id: 'u-17',
    name: 'Claire Dupont',
    email: 'claire.dupont@press.com',
    role: 'writer',
    createdAt: '2026-10-30',
  },
  {
    id: 'u-18',
    name: 'Liam Gallagher',
    email: 'liam.gallagher@press.com',
    role: 'writer',
    createdAt: '2026-11-02',
  },
  {
    id: 'u-19',
    name: 'Maya Patel',
    email: 'maya.patel@press.com',
    role: 'writer',
    createdAt: '2026-11-04',
  },
  {
    id: 'u-20',
    name: 'Alexander Schmidt',
    email: 'alex.schmidt@press.com',
    role: 'writer',
    createdAt: '2026-11-05',
  },
  { id: 'u-21', name: 'Jonathan Reynolds', email: 'jreynolds@gmail.com', role: 'reader', createdAt: '2026-10-01' },
  { id: 'u-22', name: 'Emily Watson', email: 'emily.watson92@outlook.com', role: 'reader', createdAt: '2026-10-02' },
  { id: 'u-23', name: 'Benjamin Hayes', email: 'bhayes@ventures.io', role: 'reader', createdAt: '2026-10-03' },
  { id: 'u-24', name: 'Olivia Martin', email: 'omartin@capital.com', role: 'reader', createdAt: '2026-10-04' },
  { id: 'u-25', name: 'Lucas Silva', email: 'lucas.silva@techgroup.br', role: 'reader', createdAt: '2026-10-05' },
  { id: 'u-26', name: 'Chloe Bennett', email: 'chloeb@stanford.edu', role: 'reader', createdAt: '2026-10-06' },
  { id: 'u-27', name: 'Daniel Brooks', email: 'dbrooks@finance.co', role: 'reader', createdAt: '2026-10-07' },
  { id: 'u-28', name: 'Grace Kim', email: 'grace.kim@pacific.kr', role: 'reader', createdAt: '2026-10-08' },
  { id: 'u-29', name: 'Ethan Hunt', email: 'ehunt@mission.org', role: 'reader', createdAt: '2026-10-09' },
  { id: 'u-30', name: 'Hannah Scott', email: 'hannah.scott@media.net', role: 'reader', createdAt: '2026-10-10' },
  { id: 'u-31', name: 'Noah Campbell', email: 'noahc@consulting.com', role: 'reader', createdAt: '2026-10-11' },
  { id: 'u-32', name: 'Ava Mitchell', email: 'ava.mitchell@design.io', role: 'reader', createdAt: '2026-10-12' },
  { id: 'u-33', name: 'William Turner', email: 'wturner@enterprise.com', role: 'reader', createdAt: '2026-10-13' },
  { id: 'u-34', name: 'Mia Ross', email: 'mross@analytics.co', role: 'reader', createdAt: '2026-10-14' },
  { id: 'u-35', name: 'Henry Adams', email: 'hadams@trade.org', role: 'reader', createdAt: '2026-10-15' },
  { id: 'u-36', name: 'Zoe Cooper', email: 'zoe.cooper@cloud.net', role: 'reader', createdAt: '2026-10-16' },
  { id: 'u-37', name: 'Jack Taylor', email: 'jtaylor@supply.com', role: 'reader', createdAt: '2026-10-17' },
  { id: 'u-38', name: 'Lily Foster', email: 'lfoster@growth.ai', role: 'reader', createdAt: '2026-10-18' },
  { id: 'u-39', name: 'Samuel Price', email: 'sprice@equity.co', role: 'reader', createdAt: '2026-10-19' },
  { id: 'u-40', name: 'Victoria Howard', email: 'vhoward@globalfund.com', role: 'reader', createdAt: '2026-10-20' },
];

function normalizeRole(role?: string): 'admin' | 'writer' | 'reader' {
  const r = String(role || 'reader').toLowerCase().trim();
  if (r === 'admin') return 'admin';
  if (r === 'writer' || r === 'writter') return 'writer';
  return 'reader';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let dbUsers: any[] = [];
    try {
      dbUsers = await query<any[]>(
        'SELECT id, name, email, role, avatar, created_at as createdAt FROM users ORDER BY id DESC'
      );
    } catch {}

    // Keep seed users cleanly intact while merging persisted DB users
    const combined: AdminUser[] = [...SEED_USERS];
    if (Array.isArray(dbUsers) && dbUsers.length > 0) {
      dbUsers.forEach((du) => {
        const cleanEmail = String(du.email || '').trim().toLowerCase();
        if (!cleanEmail) return;
        const existingIdx = combined.findIndex((u) => u.email.toLowerCase() === cleanEmail);
        const normalizedRole = normalizeRole(du.role);
        const userObj: AdminUser = {
          id: `db-${du.id}`,
          name: du.name || 'User',
          email: du.email,
          role: normalizedRole,
          avatar: du.avatar || undefined,
          createdAt: du.createdAt ? new Date(du.createdAt).toISOString().split('T')[0] : '2026-10-01',
          isDefaultAdmin: cleanEmail === DEFAULT_ADMIN_EMAIL,
        };
        if (existingIdx !== -1) {
          combined[existingIdx] = userObj;
        } else {
          combined.push(userObj);
        }
      });
    }

    let filtered = combined;
    if (role && role !== 'all') {
      filtered = combined.filter((u) => u.role === normalizeRole(role));
    }

    const counts = {
      all: combined.length,
      admins: combined.filter((u) => u.role === 'admin').length,
      writers: combined.filter((u) => u.role === 'writer').length,
      readers: combined.filter((u) => u.role === 'reader').length,
    };

    return NextResponse.json({
      success: true,
      users: filtered,
      counts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role = 'writer', password = 'Password123!' } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required.' }, { status: 400 });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanRole = normalizeRole(role);
    const passwordHash = await bcrypt.hash(String(password || 'Password123!'), 10);

    let dbId: string | number = `u-${Date.now()}`;
    try {
      const insertRes: any = await query(
        `INSERT INTO users (name, email, role, password_hash, writer_name)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           role = VALUES(role),
           writer_name = VALUES(writer_name),
           password_hash = COALESCE(password_hash, VALUES(password_hash))`,
        [cleanName, cleanEmail, cleanRole, passwordHash, cleanName]
      );
      if (insertRes?.insertId) {
        dbId = `db-${insertRes.insertId}`;
      }
    } catch (err) {
      console.warn('POST /api/admin/users MySQL insert fallback:', (err as any)?.message);
    }

    const newUser: AdminUser = {
      id: dbId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, originalEmail, role } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const lookupEmail = String(originalEmail || email).trim().toLowerCase();
    const cleanRole = normalizeRole(role);

    if (lookupEmail === DEFAULT_ADMIN_EMAIL || cleanEmail === DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Default administrator account cannot be modified.' },
        { status: 403 }
      );
    }

    try {
      await query(
        'UPDATE users SET name = ?, email = ?, role = ?, writer_name = ? WHERE LOWER(email) = ?',
        [cleanName, cleanEmail, cleanRole, cleanName, lookupEmail]
      );
    } catch (err) {
      console.warn('PUT /api/admin/users MySQL update fallback:', (err as any)?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: { id, name: cleanName, email: cleanEmail, role: cleanRole },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required to delete user.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Default administrator account cannot be deleted.' },
        { status: 403 }
      );
    }

    try {
      await query('DELETE FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    } catch (err) {
      console.warn('DELETE /api/admin/users MySQL delete fallback:', (err as any)?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
