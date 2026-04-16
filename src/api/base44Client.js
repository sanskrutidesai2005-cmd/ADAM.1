export const base44 = {
  auth: {
    me: async () => {
      return {
        email: 'sanskruti@example.com',
        name: 'sanskruti desai',
        id: 'user_123'
      };
    },
    logout: async () => {
      console.log('Logged out');
    }
  },
  entities: {
    UserProfile: {
      filter: async (query) => {
        const stored = localStorage.getItem('adam_user_profile');
        if (stored) return [JSON.parse(stored)];
        
        const defaultProfile = {
          user_email: 'sanskruti@example.com',
          name: 'sanskruti desai',
          age: 18,
          gender: 'Female',
          blood_type: 'B+',
          height: '165 cm',
          weight: '65 kg',
          blood_pressure: '120/80',
          heart_rate: '72 bpm'
        };
        localStorage.setItem('adam_user_profile', JSON.stringify(defaultProfile));
        return [defaultProfile];
      },
      update: async (id, data) => {
        const stored = localStorage.getItem('adam_user_profile');
        const profile = stored ? JSON.parse(stored) : {};
        const updated = { ...profile, ...data };
        localStorage.setItem('adam_user_profile', JSON.stringify(updated));
        return updated;
      }
    },
    SymptomReport: {
      filter: async (query) => {
        return [
          {
            id: 'report_1',
            created_date: '2026-10-01T10:00:00Z',
            symptoms: ['Fever'],
            diagnosis: 'Fever'
          },
          {
            id: 'report_2',
            created_date: '2026-10-01T09:00:00Z',
            symptoms: ['Fever'],
            diagnosis: 'Fever'
          }
        ];
      },
      create: async (data) => {
        console.log('Created report', data);
        return { id: 'new_report_' + Date.now(), ...data };
      }
    },
    MedicineReminder: {
      filter: async () => [],
      create: async () => {}
    },
    EmergencyContact: {
      filter: async () => [],
      create: async () => {}
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        return { file_url: URL.createObjectURL(file) };
      }
    },
    AI: {
      Chat: async ({ messages, profile }) => {
        const lastUser = [...(messages || [])].reverse().find((m) => m?.role === 'user');
        const text = (lastUser?.content || '').toLowerCase();

        const urgentSignals = [
          'chest pain',
          'shortness of breath',
          'difficulty breathing',
          'faint',
          'unconscious',
          'severe bleeding',
          'stroke',
          'seizure',
          'suicidal',
          'self-harm'
        ];

        const hasUrgent = urgentSignals.some((k) => text.includes(k));

        const age = profile?.age ?? null;
        const gender = profile?.gender ?? null;

        if (!text.trim()) {
          return { role: 'assistant', content: 'Tell me what you’re feeling and since when.' };
        }

        if (hasUrgent) {
          return {
            role: 'assistant',
            content:
              'This could be urgent. Please call your local emergency number or go to the nearest hospital now.\n\nIf you can, share: your location, symptoms, and when it started.'
          };
        }

        const feverLike = ['fever', 'chills', 'cough', 'sore throat', 'runny nose', 'body ache', 'fatigue'];
        const giLike = ['nausea', 'vomit', 'vomiting', 'diarrhea', 'stomach', 'abdominal'];
        const headacheLike = ['headache', 'migraine', 'dizzy', 'dizziness'];

        const hasFeverLike = feverLike.some((k) => text.includes(k));
        const hasGiLike = giLike.some((k) => text.includes(k));
        const hasHeadacheLike = headacheLike.some((k) => text.includes(k));

        const introBits = [
          'I can help you think through possibilities and next steps.',
          age ? `Age: ${age}` : null,
          gender ? `Sex: ${gender}` : null
        ].filter(Boolean);

        let guidance = '';

        if (hasFeverLike) {
          guidance =
            'Based on what you shared, this may be a viral illness or upper respiratory infection.\n\nTry:\n- Rest and fluids\n- Monitor temperature\n- Seek medical advice if fever lasts >3 days, you feel worse, or you have breathing issues';
        } else if (hasGiLike) {
          guidance =
            'This sounds like a stomach bug or food-related issue.\n\nTry:\n- Oral rehydration / small sips of fluids\n- Light foods if tolerated\n- Seek care if there is blood, severe pain, or dehydration';
        } else if (hasHeadacheLike) {
          guidance =
            'Headache can have many causes (stress, dehydration, sleep issues).\n\nTry:\n- Water and rest\n- Reduce screen time\n- Seek care if it’s sudden/severe, with weakness, confusion, or vision changes';
        } else {
          guidance =
            'To guide you better, answer these:\n- What symptoms do you have?\n- Since when did it start?\n- Any fever, chest pain, breathing issues, or severe pain?\n- Any existing conditions or current medicines?';
        }

        return {
          role: 'assistant',
          content: `${introBits.join(' • ')}\n\n${guidance}\n\nThis is general information, not a medical diagnosis.`
        };
      }
    }
  }
};
