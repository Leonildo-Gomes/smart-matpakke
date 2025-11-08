import { NutrientUnit } from '../../generated/prisma/client';

/**
 * Helper function to map AI string units to our NutrientUnit enum.
 * This provides a safety layer against unexpected AI output.
 * @param unit The unit string from the AI (e.g., "grams", "kcal").
 * @returns The corresponding NutrientUnit enum value.
 */
export function normalizeNutrientUnit(unit: string): NutrientUnit {
  const lowerUnit = unit.toLowerCase().trim();

  switch (lowerUnit) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return NutrientUnit.KILOGRAM;
    case 'g':
    case 'gram':
    case 'grams':
      return NutrientUnit.GRAM;
    case 'mg':
    case 'milligram':
    case 'milligrams':
      return NutrientUnit.MILLIGRAM;
    case 'kcal':
    case 'calorie':
    case 'calories':
      return NutrientUnit.KILOCALORIE;
    case 'ml':
    case 'milliliter':
    case 'milliliters':
      return NutrientUnit.MILLILITER;
    case 'l':
    case 'liter':
    case 'liters':
      return NutrientUnit.LITER;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      return NutrientUnit.TEASPOON;
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      return NutrientUnit.TABLESPOON;
    case 'unit':
    case 'units':
      return NutrientUnit.UNIT;
    default:
      // If the unit is unknown, log a warning and default to 'UNIT'.
      console.warn(`Unknown nutrient unit '${unit}', defaulting to 'UNIT'.`);
      return NutrientUnit.UNIT;
  }
}
