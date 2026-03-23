import React, { useState } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Organization() {
  const [orgInfo, setOrgInfo] = useState({
    name: 'Green Earth Organization',
    email: 'contact@greenearth.org',
    phone: '+84 123 456 789',
    address: '123 Le Loi Street, District 1, Ho Chi Minh City',
    website: 'https://greenearth.org',
    description: 'Green Earth is a non-profit organization, contributing to organizing campaigns to improve the environment and clean the earth.',
    facebook: 'facebook.com/greenearth',
    twitter: 'twitter.com/greenearth',
    instagram: 'instagram.com/greenearth',
    youtube: 'youtube.com/greenearth',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Info</h1>
          <p className="text-slate-500">Update contact information and introduction about Green Earth.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900">Organization Logo</h3>
            <p className="text-xs text-slate-500 mt-1">Recommended 512x512px, PNG or SVG format.</p>
            <button className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors w-full">
              Change Logo
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Social Media</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 text-blue-600" />
                <input type="text" value={orgInfo.facebook} className="flex-1 text-sm bg-slate-50 border-none rounded-lg p-2" />
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-sky-500" />
                <input type="text" value={orgInfo.twitter} className="flex-1 text-sm bg-slate-50 border-none rounded-lg p-2" />
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-pink-600" />
                <input type="text" value={orgInfo.instagram} className="flex-1 text-sm bg-slate-50 border-none rounded-lg p-2" />
              </div>
              <div className="flex items-center gap-3">
                <Youtube className="w-5 h-5 text-red-600" />
                <input type="text" value={orgInfo.youtube} className="flex-1 text-sm bg-slate-50 border-none rounded-lg p-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Organization Name</label>
              <input 
                type="text" 
                value={orgInfo.name} 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={orgInfo.email} 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={orgInfo.phone} 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Headquarters Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={orgInfo.address} 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">About Organization</label>
              <textarea 
                rows={5}
                value={orgInfo.description}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
