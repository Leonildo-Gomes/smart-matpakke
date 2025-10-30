

import { Gender } from "../../../generated/prisma/client";
export interface PlanGenerationContext {
  user: {
    age: number;
    gender: Gender;
  };
  family: {
    numberOfMembers: number;
  };
  preferences: {
    matpakkeType: string[];
    dietStyle: string[];
    allergies: string[];
    ingredientsToAvoid: string[];
  };
  planType: 'DAILY' | 'WEEKLY';
  startDate: string;
}
