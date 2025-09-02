import type { FormValues } from '../_schema/therapy-form-schema';
import  {Step1}  from '../_components/_steps/step1';
import { Step2 } from '../_components/_steps/step2';
import { Step3 } from '../_components/_steps/step3';
import { Step4 } from '../_components/_steps/step4';
import { Step5 } from '../_components/_steps/step5';
import { Individual } from '../_components/_steps/stepIndividual';
import { Couple } from '../_components/_steps/stepCouple';
import { Family } from '../_components/_steps/stepFamily';
import { IndividualDetail0  } from '../_components/_steps/_individualDetails/individualDetail0';
import { IndividualDetail1 } from '../_components/_steps/_individualDetails/individualDetail1';
import { IndividualDetail2 } from '../_components/_steps/_individualDetails/individualDetail2';
import { IndividualDetail3 } from '../_components/_steps/_individualDetails/individualDetail3';
import { IndividualDetail4 } from '../_components/_steps/_individualDetails/individualDetail4';
import { IndividualDetail5 } from '../_components/_steps/_individualDetails/individualDetail5';
import { CoupleDetail0 } from '../_components/_steps/_coupleDetails/coupleDetail0';
import { CoupleDetail1 } from '../_components/_steps/_coupleDetails/coupleDetail1';
import { CoupleDetail2 } from '../_components/_steps/_coupleDetails/coupleDetail2';
import { CoupleDetail3 } from '../_components/_steps/_coupleDetails/coupleDetail3';
import { CoupleDetail4 } from '../_components/_steps/_coupleDetails/coupleDetail4';
import { CoupleDetail5 } from '../_components/_steps/_coupleDetails/coupleDetail5';
import { FamilyDetail0 } from '../_components/_steps/_familyDetails/familyDetail0';
import { FamilyDetail1 } from '../_components/_steps/_familyDetails/familyDetail1';
import { FamilyDetail2 } from '../_components/_steps/_familyDetails/familyDetail2';
import { FamilyDetail3 } from '../_components/_steps/_familyDetails/familyDetail3';
import { FamilyDetail4 } from '../_components/_steps/_familyDetails/familyDetail4';
import { FamilyDetail5 } from '../_components/_steps/_familyDetails/familyDetail5';
import { ChildrenAges } from '../_components/_steps/kidsAge';
import { NumberOfKids } from '../_components/_steps/numberOfKids';
import { SensationDuration } from '../_components/_steps/sensationDuration';

import { PastTherapy } from '../_components/_steps/_pastTherapy/pastTherapy';
import { TherapyExperience } from '../_components/_steps/_pastTherapy/therapyExperience';
import { TherapyLocation } from '../_components/_steps/_pastTherapy/therapyLocation';
import { TherapistOrientation } from '../_components/_steps/_pastTherapy/therapistOrientation';
import { GoalsStep } from '../_components/_steps/therapyGoals';
import { PreferredApproach } from '../_components/_steps/_presentTherapy/preferredApproach';
import { QuestionType } from '../_components/_steps/_presentTherapy/questionType';
import { PreferredGender } from '../_components/_steps/_presentTherapy/preferredGender';
import { PreferredAge } from '../_components/_steps/_presentTherapy/preferredAge';
import { TimePreference } from '../_components/_steps/_presentTherapy/timePreference';
import { OtherInfo } from '../_components/_steps/otherInfo'; 

export const stepsMap = {
  step1: Step1,
  step2: Step2,
  step3: Step3,
  step4: Step4,
  step5: Step5,
  individual: Individual,
  couple: Couple,
  family: Family,
  individualDetail0: IndividualDetail0,
  individualDetail1: IndividualDetail1,
  individualDetail2: IndividualDetail2,
  individualDetail3: IndividualDetail3,
  individualDetail4: IndividualDetail4,
  individualDetail5: IndividualDetail5,
  coupeDetail0: CoupleDetail0,
  coupleDetail1: CoupleDetail1,
  coupleDetail2: CoupleDetail2,
  coupleDetail3: CoupleDetail3,
  coupleDetail4: CoupleDetail4,
  coupleDetail5: CoupleDetail5,
    familyDetail0: FamilyDetail0,   
    familyDetail1: FamilyDetail1,
    familyDetail2: FamilyDetail2,
    familyDetail3: FamilyDetail3,
    familyDetail4: FamilyDetail4,
    familyDetail5: FamilyDetail5,
    childrenAges: ChildrenAges,
    numberOfKids: NumberOfKids,
    sensationDuration: SensationDuration,
    pastTherapy: PastTherapy,
    therapyExperience: TherapyExperience,
    therapyLocation: TherapyLocation,
    therapistOrientation: TherapistOrientation,
    therapyGoals: GoalsStep,
    preferredApproach: PreferredApproach,
    questionType: QuestionType,
    preferredGender: PreferredGender,
    preferredAge: PreferredAge,
    timePreference: TimePreference,
    otherInfo: OtherInfo,
};

export function getStepFlow(formValues: FormValues): (keyof typeof stepsMap)[] {
  const flow: (keyof typeof stepsMap)[] = ['step1', 'step2', 'step3', 'step4', 'step5'];
  const path = formValues.path;

  flow.push(path);

  let reasons: number[] = [];
  let childrenAge0 = false;
  let childrenAge1to6 = false;

  if (path === 'individual') {
    reasons = formValues.individual.reasons;
    for (const reason of reasons) {
      if (reason === 6) continue;
      flow.push(`individualDetail${reason}` as keyof typeof stepsMap);
    }

  } else if (path === 'couple') {
    reasons = formValues.couple.reasons;
    for (const reason of reasons) {
      if (reason === 6) continue;
      flow.push(`coupleDetail${reason}` as keyof typeof stepsMap);
    }

} else if (path === 'family') {
  reasons = formValues.family.reasons;

  if (reasons.includes(2)) {
    flow.push('numberOfKids', 'childrenAges');

    const children = formValues.family.childrenAge ?? [];
    childrenAge0 = children.includes(0);
    childrenAge1to6 = children.some((age) => age >= 1 && age <= 5);

    if (childrenAge0) flow.push('familyDetail2');
    if (childrenAge1to6) flow.push('familyDetail3');
  }

  for (const reason of reasons) {
    if (reason === 2 || reason === 5 || reason === 6) continue;

    if (reason === 0) {
      flow.push('familyDetail0');
    } else if (reason === 1) {
      flow.push('familyDetail1');
    } else if (reason === 3) {
      flow.push('familyDetail4');
    } else if (reason === 4) {
      flow.push('familyDetail5');
    }
  }
}


  flow.push('sensationDuration', 'pastTherapy');

  if (formValues.pastTherapy !== 3) {
    flow.push('therapyExperience', 'therapyLocation', 'therapistOrientation');
  }

  flow.push(
    'therapyGoals',
    'preferredApproach',
    'questionType',
    'preferredGender',
    'preferredAge',
    'timePreference',
    'otherInfo'
  );

  return flow;
}
