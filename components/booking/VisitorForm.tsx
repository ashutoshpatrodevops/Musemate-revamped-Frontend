// components/booking/VisitorForm.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TicketTypeInfo, Visitor } from '@/types';
import { IDENTITY_TYPES, TICKET_TYPES } from '@/lib/constants';
import { Users, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface VisitorFormProps {
  ticketTypes: TicketTypeInfo[];
  visitors: Visitor[];
  onVisitorsChange: (visitors: Visitor[]) => void;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onContactInfoChange: (info: any) => void;
  identityType: string;
  identityNumber: string;
  onIdentityChange: (type: string, number: string) => void;
  hasAudioGuide: boolean;
  audioGuideQuantity: number;
  onAudioGuideChange: (has: boolean, quantity: number) => void;
  wheelchairAccess: boolean;
  onWheelchairAccessChange: (value: boolean) => void;
  specialRequirements: string;
  onSpecialRequirementsChange: (value: string) => void;
  audioGuidePrice?: number;
}

export function VisitorForm({
  ticketTypes,
  visitors,
  onVisitorsChange,
  contactInfo,
  onContactInfoChange,
  identityType,
  identityNumber,
  onIdentityChange,
  hasAudioGuide,
  audioGuideQuantity,
  onAudioGuideChange,
  wheelchairAccess,
  onWheelchairAccessChange,
  specialRequirements,
  onSpecialRequirementsChange,
  audioGuidePrice,
}: VisitorFormProps) {
  const addVisitor = () => {
    onVisitorsChange([
      ...visitors,
      { name: '', age: 0, ticketType: 'adult' },
    ]);
  };

  const removeVisitor = (index: number) => {
    onVisitorsChange(visitors.filter((_, i) => i !== index));
  };

  const updateVisitor = (index: number, field: keyof Visitor, value: any) => {
    const updated = [...visitors];
    updated[index] = { ...updated[index], [field]: value };
    onVisitorsChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={contactInfo.name}
                onChange={(e) =>
                  onContactInfoChange({ ...contactInfo, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={contactInfo.email}
                onChange={(e) =>
                  onContactInfoChange({ ...contactInfo, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                value={contactInfo.phone}
                onChange={(e) =>
                  onContactInfoChange({ ...contactInfo, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 Main St, City"
                value={contactInfo.address}
                onChange={(e) =>
                  onContactInfoChange({ ...contactInfo, address: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Identity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="identityType">Identity Type *</Label>
              <Select value={identityType} onValueChange={(value) => onIdentityChange(value, identityNumber)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  {IDENTITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identityNumber">Identity Number</Label>
              <Input
                id="identityNumber"
                placeholder="Enter ID number"
                value={identityNumber}
                onChange={(e) => onIdentityChange(identityType, e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Visitor Details
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addVisitor}>
              <Plus className="h-4 w-4 mr-1" />
              Add Visitor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {visitors.map((visitor, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-4 relative"
            >
              {visitors.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeVisitor(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <h4 className="font-semibold">Visitor {index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    placeholder="Visitor name"
                    value={visitor.name}
                    onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age *</Label>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={visitor.age || ''}
                    onChange={(e) =>
                      updateVisitor(index, 'age', parseInt(e.target.value) || 0)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ticket Type *</Label>
                  <Select
                    value={visitor.ticketType}
                    onValueChange={(value) => updateVisitor(index, 'ticketType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          {type.type.charAt(0).toUpperCase() + type.type.slice(1)} -{' '}
                          {formatCurrency(type.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {visitors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No visitors added yet</p>
              <Button type="button" variant="outline" className="mt-4" onClick={addVisitor}>
                <Plus className="h-4 w-4 mr-1" />
                Add First Visitor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Guide */}
          {audioGuidePrice !== undefined && audioGuidePrice > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="audioGuide"
                  checked={hasAudioGuide}
                  onCheckedChange={(checked) =>
                    onAudioGuideChange(checked as boolean, audioGuideQuantity)
                  }
                />
                <Label htmlFor="audioGuide" className="cursor-pointer">
                  Add Audio Guide ({formatCurrency(audioGuidePrice)} per device)
                </Label>
              </div>
              {hasAudioGuide && (
                <div className="ml-6 space-y-2">
                  <Label>Number of Audio Guides</Label>
                  <Input
                    type="number"
                    min="1"
                    max={visitors.length}
                    value={audioGuideQuantity}
                    onChange={(e) =>
                      onAudioGuideChange(true, parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* Wheelchair Access */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wheelchair"
              checked={wheelchairAccess}
              onCheckedChange={(checked) => onWheelchairAccessChange(checked as boolean)}
            />
            <Label htmlFor="wheelchair" className="cursor-pointer">
              Wheelchair Access Required
            </Label>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Textarea
              id="specialRequirements"
              placeholder="Any special requirements or notes..."
              value={specialRequirements}
              onChange={(e) => onSpecialRequirementsChange(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}