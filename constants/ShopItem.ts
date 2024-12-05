import * as Yup from "yup";

// Define CATEGORY_UNITS with explicit keys
export const CATEGORY_UNITS = {
  vegetables: ["kg", "grams", "pieces"],
  fruits: ["kg", "grams", "pieces"],
  dairy: ["liter", "ml", "pieces"],
  bakery: ["pieces", "grams"],
  meat: ["kg", "grams"],
  grains: ["kg", "grams"],
  pantry: ["pieces", "kg", "grams", "ml"],
  other: ["pieces", "kg", "grams", "ml", "liter"],
};

// Define categories
export const CATEGORIES = Object.keys(CATEGORY_UNITS);

// Define priority levels
export enum PRIORITY_LEVELS {
  Low = 0,
  Medium = 1,
  High = 2,
}

export const itemValidationSchema = Yup.object({
  name: Yup.string()
    .required("Item name is required")
    .min(2, "Item name must be at least 2 characters long")
    .max(100, "Item name must not exceed 100 characters"),

  category: Yup.string()
    .oneOf(
      [
        "vegetables",
        "fruits",
        "dairy",
        "bakery",
        "meat",
        "grains",
        "pantry",
        "other",
      ],
      "Invalid category"
    )
    .required("Category is required"),

  note: Yup.string()
    .max(200, "Note should not exceed 200 characters")
    .optional(), // Optional field

  priority: Yup.number()
    .oneOf([0, 1, 2], "Priority must be low, medium, high")
    .required("Priority is required"),

  quantity: Yup.number()
    .required("Quantity is required")
    .min(0.1, "Quantity must be at least 0.1") // Minimum quantity can be 0.1 for fractional items like kg
    .max(1000, "Quantity should not exceed 1000"), // Optional upper limit

  unit: Yup.string()
    .required("Unit is required")
    .oneOf(
      ["kg", "grams", "pieces", "liter", "ml"],
      "Unit must be one of the following: kg, grams, pieces, liter, ml"
    ),

  purchased: Yup.boolean().required("Purchased status is required"),
});

export const getPriorityLabel = (value: number): string => {
  switch (value) {
    case PRIORITY_LEVELS.Low:
      return "Low";
    case PRIORITY_LEVELS.Medium:
      return "Medium";
    case PRIORITY_LEVELS.High:
      return "High";
    default:
      return "Low"; // Fallback for unexpected values
  }
};

export function getSelectorColor(priority: PRIORITY_LEVELS): string {
  switch (priority) {
    case PRIORITY_LEVELS.Low:
      return "$yellow6";
    case PRIORITY_LEVELS.Medium:
      return "$orange7";
    case PRIORITY_LEVELS.High:
      return "$orange9";
    default:
      return "$yellow6";
  }
}
