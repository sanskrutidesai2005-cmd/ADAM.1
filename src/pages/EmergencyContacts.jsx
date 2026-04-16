import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslation } from '@/translations';
import { Phone, Siren, Flame, HeartPulse, PersonStanding, Brain, Syringe, Baby, User, CloudSun } from 'lucide-react';

export default function EmergencyContacts() {
  const contacts = [
    { name: "National Emergency Ambulance", number: "108", icon: Siren, color: "text-red-600", bg: "bg-red-100", description: "Free emergency ambulance service available across India" },
    { name: "Police Emergency", number: "100", icon: Siren, color: "text-blue-600", bg: "bg-blue-100", description: "Police emergency helpline for immediate assistance" },
    { name: "Fire Emergency", number: "101", icon: Flame, color: "text-orange-600", bg: "bg-orange-100", description: "Fire department emergency response" },
    { name: "Medical Helpline", number: "104", icon: HeartPulse, color: "text-teal-600", bg: "bg-teal-100", description: "Medical consultation and advice helpline" },
    { name: "Women Helpline", number: "1091", icon: PersonStanding, color: "text-pink-600", bg: "bg-pink-100", description: "Women in distress helpline" },
    { name: "Mental Health Helpline", number: "9152987821", icon: Brain, color: "text-purple-600", bg: "bg-purple-100", description: "Counseling and mental health support" },
    { name: "Poison Control Center", number: "1066", icon: Syringe, color: "text-green-600", bg: "bg-green-100", description: "Emergency poison information and treatment guidance" },
    { name: "Child Helpline", number: "1098", icon: Baby, color: "text-yellow-600", bg: "bg-yellow-100", description: "Helpline for children in need of care and protection" },
    { name: "Senior Citizen Helpline", number: "14567", icon: User, color: "text-gray-600", bg: "bg-gray-100", description: "Helpline for elderly citizens requiring assistance" },
    { name: "Disaster Management", number: "1070", icon: CloudSun, color: "text-indigo-600", bg: "bg-indigo-100", description: "National disaster management helpline" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">{getTranslation('emergencyTitle')}</h1>
        <p className="text-slate-500 mt-2">{getTranslation('emergencySubtitle')}</p>
      </div>

      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center">
        {getTranslation('emergencyWarning')}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {contacts.map((contact, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg ${contact.bg} flex items-center justify-center ${contact.color}`}>
                  <contact.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-md text-slate-800">{contact.name}</h3>
                  <p className="text-slate-500 text-sm">{contact.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{getTranslation('availableRegion')}</p>
                </div>
              </div>
              <Button asChild size="default" className="bg-red-600 hover:bg-red-700 text-white">
                <a href={`tel:${contact.number}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  {getTranslation('callNow')}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
