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
import { Loader2, Star, ShieldCheck } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

type Museum = {
  _id: string;
  title: string;
  city: string;
  status: 'active' | 'inactive' | 'pending_approval';
  isFeatured: boolean;
  isVerified: boolean;
};

export function MuseumsTable() {
  const { getToken } = useAuth();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMuseums = async () => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/museums/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const payload = await res.json();
      setMuseums(payload.data ?? payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  const updateMuseum = async (
    id: string,
    endpoint: string,
    body?: object
  ) => {
    const token = await getToken();
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/museums/admin/${id}/${endpoint}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      }
    );
    fetchMuseums();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Museums</CardTitle>
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
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {museums.map((museum) => (
                <TableRow key={museum._id}>
                  <TableCell className="font-medium">
                    {museum.title}
                  </TableCell>

                  <TableCell>{museum.city}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        museum.status === 'active'
                          ? 'default'
                          : museum.status === 'pending_approval'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {museum.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {museum.isVerified ? (
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  <TableCell>
                    {museum.isFeatured ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    {museum.status === 'pending_approval' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateMuseum(museum._id, 'status', {
                              status: 'active',
                            })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateMuseum(museum._id, 'status', {
                              status: 'inactive',
                            })
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {museum.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateMuseum(museum._id, 'status', {
                            status: 'inactive',
                          })
                        }
                      >
                        Deactivate
                      </Button>
                    )}

                    {museum.status === 'inactive' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateMuseum(museum._id, 'status', {
                            status: 'active',
                          })
                        }
                      >
                        Activate
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateMuseum(museum._id, 'verify')
                      }
                    >
                      Verify
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateMuseum(museum._id, 'featured')
                      }
                    >
                      Feature
                    </Button>
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
