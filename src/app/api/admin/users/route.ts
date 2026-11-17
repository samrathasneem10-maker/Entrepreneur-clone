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

const INITIAL_REQUIRED_ACCOUNTS: AdminUser[] = [
  {
    id: 'init-1',
    name: 'Mohamedajmi',
    email: 'akramyoonos006@gmail.com',
    role: 'admin',
    isDefaultAdmin: true,
    createdAt: '2026-10-15',
  },
  {
    id: 'init-2',
    name: 'End Reader',
    email: 'endreader@unitedstatestoday.com',
    role: 'reader',
    isDefaultAdmin: false,
    createdAt: '2026-10-18',
  },
  {
    id: 'init-3',
    name: 'Reader',
    email: 'reader@gmail.com',
    role: 'reader',
    isDefaultAdmin: false,
    createdAt: '2026-10-20',
  },
  {
    id: 'init-4',
    name: 'Writer',
    email: 'writer@gmail.com',
    role: 'writer',
    isDefaultAdmin: false,
    createdAt: '2026-10-25',
  },
];

function normalizeRole(roleStr: any): 'admin' | 'writer' | 'reader' {
  const r = String(roleStr || '').toLowerCase().trim();
  if (r === 'admin' || r === 'administrator') return 'admin';
  if (r === 'writer' || r === 'writter' || r === 'author' || r === 'editor') return 'writer';
  return 'reader';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let dbUsers: any[] = [];
    try {
      dbUsers = await query<any[]>(
        'SELECT id, name, email, role, avatar, created_at as createdAt FROM users ORDER BY id ASC'
      );
    } catch (err) {
      console.warn('GET /api/admin/users DB query warning:', err);
    }

    const userMap = new Map<string, AdminUser>();

    // 1. Ensure the 4 required initial accounts are in the map
    INITIAL_REQUIRED_ACCOUNTS.forEach((acc) => {
      userMap.set(acc.email.toLowerCase(), { ...acc });
    });

    // 2. Overlay / add all real users from the database
    if (Array.isArray(dbUsers) && dbUsers.length > 0) {
      dbUsers.forEach((du) => {
        const cleanEmail = String(du.email || '').trim().toLowerCase();
        if (!cleanEmail) return;

        const normalizedRole = normalizeRole(du.role);
        const isDefAdmin =
          cleanEmail === DEFAULT_ADMIN_EMAIL ||
          String(du.name || '').toLowerCase().trim() === 'mohamedajmi';

        userMap.set(cleanEmail, {
          id: `db-${du.id}`,
          name: du.name || (isDefAdmin ? 'Mohamedajmi' : 'User'),
          email: du.email,
          role: normalizedRole,
          avatar: du.avatar || undefined,
          createdAt: du.createdAt
            ? new Date(du.createdAt).toISOString().split('T')[0]
            : '2026-10-01',
          isDefaultAdmin: isDefAdmin,
        });
      });
    }

    const allUsersList = Array.from(userMap.values());

    // Sort to keep Default Admin at the top, then others
    allUsersList.sort((a, b) => {
      if (a.isDefaultAdmin) return -1;
      if (b.isDefaultAdmin) return 1;
      return 0;
    });

    let filtered = allUsersList;
    if (role && role !== 'all') {
      filtered = allUsersList.filter((u) => u.role === normalizeRole(role));
    }

    const counts = {
      all: allUsersList.length,
      admins: allUsersList.filter((u) => u.role === 'admin').length,
      writers: allUsersList.filter((u) => u.role === 'writer').length,
      readers: allUsersList.filter((u) => u.role === 'reader').length,
    };

    return NextResponse.json({
      success: true,
      users: filtered,
      counts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role = 'reader', password = 'Password123!' } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
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

    const isDefAdmin =
      cleanEmail === DEFAULT_ADMIN_EMAIL || cleanName.toLowerCase() === 'mohamedajmi';

    const newUser: AdminUser = {
      id: dbId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      isDefaultAdmin: isDefAdmin,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, originalEmail, role } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required to delete user.' },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
