'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Museum, TicketTypeInfo, TimeSlot, Facility, OperatingHours,MuseumFormData } from '@/types/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TicketType } from '@/lib/constants';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { api, endpoints } from '@/lib/api';

import Image from 'next/image';
import { toast } from 'sonner';

interface MuseumFormProps {
  initialData?: Museum | null;
  onSubmit: (data: any) => void;
  loading: boolean;
  submitLabel: string;
}
interface UploadResponse {
  images: Array<{ url: string; filename: string }>;
}
const MUSEUM_CATEGORIES = [
  'Art Museums',
        'History Museums',
        'Science Museums',
        'Technology & Innovation Museums',
        'Biographical Museums',
        'War & Military Museums',
        'Fashion & Textile Museums',
        'Aviation & Aerospace Museums',
];

const FACILITIES = [
  'Wheelchair Access',
  'Parking',
  'Cafe',
  'Gift Shop',
  'Restrooms',
  'WiFi',
  'Guided Tours',
  'Audio Guide',
  'Lockers',
  'Photography Allowed',
];
const defaultDayHours = {
  open: '09:00',
  close: '18:00',
  isClosed: false,
};

const defaultOperatingHours: OperatingHours = {
  monday: { ...defaultDayHours },
  tuesday: { ...defaultDayHours },
  wednesday: { ...defaultDayHours },
  thursday: { ...defaultDayHours },
  friday: { ...defaultDayHours },
  saturday: { ...defaultDayHours },
  sunday: { ...defaultDayHours },
};

export function MuseumForm({ initialData, onSubmit, loading, submitLabel }: MuseumFormProps) {
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images?.map(img => img.url) || []
  );
  const [uploadedImageUrls, setUploadedImageUrls] = useState<Array<{ url: string; filename: string }>>(
    initialData?.images || []
  );
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState<MuseumFormData>({
  title: '',
  description: '',
  category: '',
  virtualTourUrl: '',

  location: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  latitude: '',
  longitude: '',

  dailyCapacity: 0,
  ticketTypes: [],
  timeSlots: [],

  facilities: [],

  hasAudioGuide: false,
  audioGuidePrice: 0,

  operatingHours:defaultOperatingHours,

  contactPhone: '',
  contactEmail: '',
  contactWebsite: '',

  facebook: '',
  instagram: '',
  twitter: '',
});


  const steps = [
    { title: 'Images', fields: ['images'] },
    { title: 'Basic Information', fields: ['title', 'description', 'category'] },
    { title: 'Location', fields: ['location', 'city', 'state', 'country'] },
    { title: 'Tickets & Pricing', fields: ['ticketTypes', 'dailyCapacity'] },
    { title: 'Operating Hours', fields: ['operatingHours'] },
    { title: 'Facilities', fields: ['facilities'] },
    { title: 'Contact & Social', fields: ['contactPhone', 'contactEmail'] },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTicketType = () => {
  setFormData(prev => ({
    ...prev,
    ticketTypes: [
      ...prev.ticketTypes,
      {
        type: 'adult',   // ✅ must be one of TicketType union values
        price: 0,
        description: '',
      },
    ],
  }));
};

  const removeTicketType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  const updateTicketType = <K extends keyof TicketTypeInfo>(
  index: number,
  field: K,
  value: TicketTypeInfo[K]
) => {
  setFormData(prev => ({
    ...prev,
    ticketTypes: prev.ticketTypes.map((ticket, i) =>
      i === index ? { ...ticket, [field]: value } : ticket
    ),
  }));
};

  // Image handling functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnder5MB = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isImage) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (!isUnder5MB) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // Check if this is a newly uploaded file or existing image
    const isNewImage = index >= uploadedImageUrls.length;
    
    if (isNewImage) {
      // Remove from new images
      const newImageIndex = index - uploadedImageUrls.length;
      
      // Revoke the URL to free memory
      if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
      
      setImages(prev => prev.filter((_, i) => i !== newImageIndex));
    } else {
      // Remove from existing images
      setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<Array<{ url: string; filename: string }>> => {
  if (images.length === 0) return [];

  try {
    setUploadingImages(true);
    toast.info('Uploading images...');

    const token = await getToken();
    if (!token) throw new Error('Authentication required');

    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    const response = await api.uploadFile<{
      success: boolean;
      message: string;
      data: Array<{ url: string; filename: string }>;
    }>(endpoints.upload.images, formData, token);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload images');
    }

    const uploadedImages = Array.isArray(response.data) ? response.data : [];

    if (uploadedImages.length === 0) {
      throw new Error('No images were uploaded from server');
    }

    toast.success(`Successfully uploaded ${uploadedImages.length} image(s)`);
    return uploadedImages;
  } catch (error: any) {
    console.error('Error uploading images:', error);
    toast.error(error.message || 'Failed to upload images');
    throw error;
  } finally {
    setUploadingImages(false);
  }
};




  const handleNext = async () => {
    // Validate current step
    if (currentStep === 0 && imagePreviews.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast.error('Please enter museum name');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Please enter museum description');
        return;
      }
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.location.trim() || !formData.city.trim() || 
          !formData.state.trim() || !formData.country.trim()) {
        toast.error('Please fill in all required location fields');
        return;
      }
    }

    if (currentStep === 3) {
      if (formData.ticketTypes.length === 0) {
        toast.error('Please add at least one ticket type');
        return;
      }
      const hasEmptyTicket = formData.ticketTypes.some(t => !t.type.trim() || t.price < 0);
      if (hasEmptyTicket) {
        toast.error('Please fill in all ticket type details');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload new images first if there are any
      let newlyUploadedImages: Array<{ url: string; filename: string }> = [];
      
      if (images.length > 0) {
        newlyUploadedImages = await uploadImages();
      }

      // Combine existing images (from initialData) with newly uploaded images
      const allImages = [...uploadedImageUrls, ...newlyUploadedImages];

      if (allImages.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }

      // Format data for API
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        virtualTourUrl: formData.virtualTourUrl || undefined,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode || undefined,
        geometry: {
          type: 'Point' as const,
          coordinates: [
            parseFloat(formData.longitude as string) || 0,
            parseFloat(formData.latitude as string) || 0,
          ],
        },
        dailyCapacity: formData.dailyCapacity,
        ticketTypes: formData.ticketTypes.filter(t => t.type.trim() !== ''),
        // facilities: formData.facilities.map((name) => ({
        //   name,
        //   available: true,
        // })),
        facilities:formData.facilities,
        hasAudioGuide: formData.hasAudioGuide,
        audioGuidePrice: formData.hasAudioGuide ? formData.audioGuidePrice : undefined,
        operatingHours: formData.operatingHours,
        contactInfo: {
          phone: formData.contactPhone || undefined,
          email: formData.contactEmail || undefined,
          website: formData.contactWebsite || undefined,
        },
        socialMedia: {
          facebook: formData.facebook || undefined,
          instagram: formData.instagram || undefined,
          twitter: formData.twitter || undefined,
        },
        timeSlots: formData.timeSlots.filter(slot => slot.startTime && slot.endTime),
        images: allImages, // This should now be an array of { url, filename } objects
      };

      console.log('Submitting data:', submitData); // Debug log
      console.log('=== FINAL SUBMIT DATA ===');
console.log('Images:', allImages);
console.log('Title:', formData.title);
console.log('Category:', formData.category);
console.log('TicketTypes:', formData.ticketTypes);
console.log('Facilities:', formData.facilities);
console.log('=========================');

onSubmit(submitData);

    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 0: Images */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Museum Images *</Label>
                <p className="text-sm text-muted-foreground">
                  Upload high-quality images of your museum. First image will be the cover image.
                </p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                </label>
              </div>

              {imagePreviews.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <ImageIcon className="h-4 w-4" />
                  <span>No images uploaded yet. Add at least one image to continue.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Museum Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="National Museum of India"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your museum..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateFormData('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSEUM_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="virtualTourUrl">Virtual Tour URL (Optional)</Label>
                <Input
                  id="virtualTourUrl"
                  value={formData.virtualTourUrl}
                  onChange={(e) => updateFormData('virtualTourUrl', e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Address *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="123 Museum Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="New Delhi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="Delhi"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    placeholder="India"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    placeholder="110001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => updateFormData('latitude', e.target.value)}
                    placeholder="28.6139"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => updateFormData('longitude', e.target.value)}
                    placeholder="77.2090"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tickets & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dailyCapacity">Daily Capacity *</Label>
                <Input
                  id="dailyCapacity"
                  type="number"
                  min="1"
                  value={formData.dailyCapacity}
                  onChange={(e) => updateFormData('dailyCapacity', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Ticket Types *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTicketType}>
                    Add Ticket Type
                  </Button>
                </div>

                {formData.ticketTypes.map((ticket, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Type *</Label>
                         <Input
                            value={ticket.type}
                            onChange={(e) =>
                             updateTicketType(index, 'type', e.target.value as TicketType)
                            }
                            placeholder="e.g., adult, child, senior"
                             required
                            />

                        </div>
                        <div className="space-y-2">
                          <Label>Price (₹) *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value) || 0)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                          value={ticket.description || ''}
                          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                          placeholder="Age limits, restrictions..."
                        />
                      </div>
                      {formData.ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Operating Hours */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Label>Operating Hours</Label>
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <Card key={day}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 font-medium capitalize">{day}</div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) =>
                            updateFormData('operatingHours', {
                              ...formData.operatingHours,
                              [day]: { ...hours, open: e.target.value },
                            })
                          }
                          disabled={hours.isClosed}
                        />
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) =>
                            updateFormData('operatingHours', {
                              ...formData.operatingHours,
                              [day]: { ...hours, close: e.target.value },
                            })
                          }
                          disabled={hours.isClosed}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={hours.isClosed}
                          onCheckedChange={(checked) =>
                            updateFormData('operatingHours', {
                              ...formData.operatingHours,
                              [day]: { ...hours, isClosed: !!checked },
                            })
                          }
                        />
                        <Label className="text-sm">Closed</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 5: Facilities */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <Label>Available Facilities</Label>
              <div className="grid grid-cols-2 gap-3">
                {FACILITIES.map((facility) => {
                  const isChecked = formData.facilities.some(
                      (f) => f.name === facility && f.available
                );

            return (
                    <div key={facility} className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('facilities', [
                              ...formData.facilities,
                              { name: facility, available: true },   // ✅ Facility object
                           ]);
                         } else {
                           updateFormData(
                             'facilities',
                             formData.facilities.filter((f) => f.name !== facility)
                           );
                         }
                       }}
                     />
                                 <Label className="font-normal">{facility}</Label>
                                 </div>
                  );
                })}
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.hasAudioGuide}
                    onCheckedChange={(checked) => updateFormData('hasAudioGuide', !!checked)}
                  />
                  <Label>Audio Guide Available</Label>
                </div>

                {formData.hasAudioGuide && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="audioGuidePrice">Audio Guide Price (₹)</Label>
                    <Input
                      id="audioGuidePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.audioGuidePrice}
                      onChange={(e) => updateFormData('audioGuidePrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Contact & Social */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Contact Information</Label>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    placeholder="+91 1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    placeholder="info@museum.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactWebsite">Website</Label>
                  <Input
                    id="contactWebsite"
                    type="url"
                    value={formData.contactWebsite}
                    onChange={(e) => updateFormData('contactWebsite', e.target.value)}
                    placeholder="https://museum.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Social Media (Optional)</Label>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => updateFormData('facebook', e.target.value)}
                    placeholder="https://facebook.com/museum"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => updateFormData('instagram', e.target.value)}
                    placeholder="https://instagram.com/museum"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => updateFormData('twitter', e.target.value)}
                    placeholder="https://twitter.com/museum"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || loading || uploadingImages}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button type="submit" disabled={loading || uploadingImages}>
            {(loading || uploadingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uploadingImages ? 'Uploading...' : submitLabel}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} disabled={loading || uploadingImages}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}