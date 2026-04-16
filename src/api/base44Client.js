import { getTranslation } from '../translations';

export const base44 = {
  auth: {
    me: async () => {
      const stored = localStorage.getItem('adam_current_user');
      if (stored) return JSON.parse(stored);
      return null;
    },
    logout: async () => {
      localStorage.removeItem('adam_auth_token');
      localStorage.removeItem('adam_current_user');
      return true;
    }
  },
  entities: {
    UserProfile: {
      filter: async (query) => {
        const currentUser = JSON.parse(localStorage.getItem('adam_current_user') || 'null');
        if (!currentUser) return [];

        const stored = localStorage.getItem(`adam_user_profile_${currentUser.email}`);
        if (stored) return [JSON.parse(stored)];

        // Calculate age from DOB if available
        let age = 25;
        if (currentUser.dob) {
          const birthDate = new Date(currentUser.dob);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }

        // Default profile for new user using data from registration if available
        return [
          {
            id: `profile_${Date.now()}`,
            user_id: currentUser.id || 'user_123',
            age: currentUser.age || age,
            gender: currentUser.gender || 'Female',
            blood_type: currentUser.blood_group || 'O+',
            weight: currentUser.weight ? `${currentUser.weight} kg` : '60 kg',
            height: currentUser.height ? `${currentUser.height} cm` : '165 cm',
            blood_pressure: '120/80',
            heart_rate: '72 bpm',
            temperature: '98.6°F',
            spo2: '98%'
          }
        ];
      },
      update: async (id, data) => {
        const currentUser = JSON.parse(localStorage.getItem('adam_current_user') || 'null');
        if (!currentUser) return null;

        localStorage.setItem(`adam_user_profile_${currentUser.email}`, JSON.stringify(data));
        return data;
      }
    },
    SymptomReport: {
      filter: async (query) => {
        const currentUser = JSON.parse(localStorage.getItem('adam_current_user') || 'null');
        if (!currentUser) return [];

        const reports = JSON.parse(localStorage.getItem('adam_health_history') || '[]');
        // In a real app, we'd filter by user_id. For now, since it's all in localStorage, 
        // we can either filter or just show what's there. 
        // Let's assume reports should be user-specific.
        return reports.filter(r => r.user_email === currentUser.email);
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
        const userMessages = (messages || []).filter(m => m.role === 'user');
        const lastUser = [...userMessages].reverse()[0];
        const text = (lastUser?.content || '').toLowerCase();
        const msgCount = userMessages.length;

        const urgentSignals = [
          'chest pain', 'shortness of breath', 'difficulty breathing', 'faint',
          'unconscious', 'severe bleeding', 'stroke', 'seizure', 'suicidal', 'self-harm'
        ];

        const hasUrgent = urgentSignals.some((k) => text.includes(k));
        const age = profile?.age ?? null;
        const gender = profile?.gender ?? null;

        if (!text.trim()) {
          return { role: 'assistant', content: getTranslation('aiResponseTellMe') };
        }

        if (hasUrgent) {
          return { role: 'assistant', content: getTranslation('aiResponseUrgent') };
        }

        const feverLike = ['fever', 'chills', 'cough', 'sore throat', 'runny nose', 'body ache', 'fatigue'];
        const giLike = ['nausea', 'vomit', 'vomiting', 'diarrhea', 'stomach', 'abdominal'];
        const headacheLike = ['headache', 'migraine', 'dizzy', 'dizziness'];

        const hasFeverLike = feverLike.some((k) => text.includes(k));
        const hasGiLike = giLike.some((k) => text.includes(k));
        const hasHeadacheLike = headacheLike.some((k) => text.includes(k));

        const introBits = [
          getTranslation('aiResponseIntro'),
          age ? `${getTranslation('age')}: ${age}` : null,
          gender ? `${getTranslation('gender')}: ${getTranslation(gender.toLowerCase()) || gender}` : null
        ].filter(Boolean);

        let diagnosis = {
          causes: '',
          actions: '',
          severity: getTranslation('mild'),
          followUps: [getTranslation('askDuration'), getTranslation('askIntensity')]
        };

        if (hasFeverLike) {
          diagnosis = {
            causes: 'Viral illness, influenza, or common cold.',
            actions: 'Rest, stay hydrated, monitor temperature.',
            severity: getTranslation('moderate'),
            followUps: [getTranslation('askDuration'), getTranslation('askOtherSymptoms')]
          };
        } else if (hasGiLike) {
          diagnosis = {
            causes: 'Stomach bug, food poisoning, or indigestion.',
            actions: 'Sip clear fluids, eat bland foods (BRAT diet), avoid dairy.',
            severity: getTranslation('moderate'),
            followUps: [getTranslation('askMedsTaken'), getTranslation('askOtherSymptoms')]
          };
        } else if (hasHeadacheLike) {
          diagnosis = {
            causes: 'Tension, dehydration, or eye strain.',
            actions: 'Drink water, rest in a quiet room, reduce screen time.',
            severity: getTranslation('mild'),
            followUps: [getTranslation('askIntensity'), getTranslation('askDuration')]
          };
        }

        // If this is the second or third message, provide a summary instead of a diagnostic structure
        if (msgCount > 1) {
          return {
            role: 'assistant',
            content: `
${getTranslation('aiAcknowledge')}

${getTranslation('aiSummary')}

**${getTranslation('severity')}**: ${diagnosis.severity}
**${getTranslation('recommendedActions')}**: ${diagnosis.actions || 'Continue to monitor and rest.'}

---
${getTranslation('aiFinalNote')}

*${getTranslation('aiResponseDisclaimer')}*
            `.trim()
          };
        }

        const structuredContent = `
${introBits.join(' • ')}

**${getTranslation('possibleCauses')}**:
${diagnosis.causes || getTranslation('aiResponseGeneral')}

**${getTranslation('recommendedActions')}**:
${diagnosis.actions || 'Stay hydrated and monitor symptoms.'}

**${getTranslation('severity')}**: ${diagnosis.severity}

**${getTranslation('nextSteps')}**:
- ${getTranslation('checkMeds')}
- ${getTranslation('contactEmergency')}

**${getTranslation('followUp')}**:
1. ${diagnosis.followUps[0]}
2. ${diagnosis.followUps[1]}

---
*${getTranslation('aiResponseDisclaimer')}*
        `.trim();

        return {
          role: 'assistant',
          content: structuredContent
        };
      }
    }
  }
};
