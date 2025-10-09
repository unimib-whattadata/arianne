import type { FormValues } from '@/app/(onboarding)/questionnaire/_schema/therapy-form-schema';

export const getDefaultFormValues = (
  path: 'individual' | 'couple' | 'family',
): FormValues => {
  const baseDefaults = {
    name: '',
    age: 0,
    gender: 0,
    duration: 0,
    pastTherapy: 0,
    therapyExperience: 0,
    therapyLocation: 0,
    therapistOrientation: 0,
    therapyGoals: [0],
    preferredApproach: 0,
    questionType: 0,
    preferredGender: 0,
    preferredAge: 0,
    preferredOrientation: 0,
    timePreference: [0],
  };

  if (path === 'individual') {
    return {
      ...baseDefaults,
      path: 'individual',
      individual: {
        reasons: [],
        details: {},
        detailText: '',
      },
    };
  }

  if (path === 'couple') {
    return {
      ...baseDefaults,
      path: 'couple',
      couple: {
        reasons: [],
        details: {},
        detailText: '',
      },
    };
  }

  // path === 'family'
  return {
    ...baseDefaults,
    path: 'family',
    family: {
      reasons: [],
      details: {},
      detailText: '',
      numberOfChildren: 0,
      childrenAge: [],
    },
  };
};
