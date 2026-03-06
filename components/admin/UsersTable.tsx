'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

type User = {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'museum_admin';
  isBanned: boolean;
};

export function UsersTable() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      setUsers(payload.data ?? payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, endpoint: string, body?: object) => {
    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/${id}/${endpoint}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isBanned ? 'destructive' : 'success'}>
                      {user.isBanned ? 'banned' : 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.isBanned ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUser(user._id, 'unban')}
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateUser(user._id, 'ban')}
                      >
                        Ban
                      </Button>
                    )}
                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUser(user._id, 'role', { role: 'admin' })}
                      >
                        Make Admin
                      </Button>
                    )}
                    {user.role !== 'museum_admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUser(user._id, 'role', { role: 'museum_admin' })}
                      >
                        Make Museum Admin
                      </Button>
                    )}
                    {user.role !== 'user' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUser(user._id, 'role', { role: 'user' })}
                      >
                        Make User
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
