import * as z from "zod";

//! MODEL & VARIANT
export const modelFormSchema = z.object({
  brand: z.string().min(2, "La marque est requise"),
  name: z.string().min(2, "Le nom du modèle est requis"),
  isActive: z.boolean(),
});

// SUREMENT A MODIFIER EN FONCTION DES MODIFS ET DU FORM (voir comment on récupère les infos des pays et des images url)
export const variantFormSchema = z.object({
  price: z.number().min(0, "Le prix doit être supérieur ou égal à 0"),
  memory: z.number(),
  color: z.string(),
  country: z.string().optional(),
  description: z.string(),
  stock: z
    .number()
    .min(0, "Le stock doit être supérieur ou égal à 0")
    .optional(),
  isActive: z.boolean(),
  modelId: z.string().optional(),
  imageUrl: z.array(z.string().url()).optional(), // imageUrl: z.string().optional(),
});

//! PROMO CODE
export const promoCodeFormSchema = z.object({
  code: z.string().min(1, "Le code promo est requis."),
  discount: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, "Le pourcentage doit être supérieur à 0.")
      .max(100, "Le pourcentage doit être inférieur ou égal à 100.")
  ),
  isActive: z.boolean().optional(),
  expiresAt: z.date({ required_error: "La date d'expiration est requise." }),
});

//! COUNTRY
export const countryFormSchema = z.object({
  name: z.string().min(2, "Le nom du pays doit contenir au moins 2 caractères"),
  imageUrl: z.string().optional(),
});

//! USER
export const userLoginSchema = z.object({
  email: z.string().email({
    message: "L'email est requis.",
  }),
  password: z.string().min(1, "Le mot de passe est requis."),
  code: z.optional(z.string()), // Pour Auhtentification à deux facteurs
});

export const userRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email({
      message: "L'email est requis.",
    }),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 6 caractères."),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Les mots de passe ne correspondent pas.",
        path: ["passwordConfirmation"],
      });
    }
  });

export const ResetSchema = z.object({
  email: z.string().email({
    message: "L'email est requis.",
  }),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Les mots de passe ne correspondent pas.",
        path: ["passwordConfirmation"],
      });
    }
  });

export const userFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(3, "La description doit contenir au moins 3 caractères")
    .max(400, "La description doit contenir au maximum 400 caractères"),
  instagram: z.string().url().or(z.string().length(0)).optional(),
  twitter: z.string().url().or(z.string().length(0)).optional(),
  tiktok: z.string().url().or(z.string().length(0)).optional(),
});

export const userProfileSchema = z.object({
  description: z.optional(
    z
      .string()
      .max(400, "La description doit contenir au maximum 400 caractères")
  ),
  instagram: z.string().url().or(z.string().length(0)).optional(),
  twitter: z.string().url().or(z.string().length(0)).optional(),
  tiktok: z.string().url().or(z.string().length(0)).optional(),
  youtube: z.string().url().or(z.string().length(0)).optional(),
  image: z.string(),
});

export const userSettingSchema = z.object({
  firstName: z.optional(
    z.string().min(2, "Le prénom doit contenir au moins 2 caractères")
  ),
  lastName: z.optional(
    z.string().min(2, "Le nom doit contenir au moins 2 caractères")
  ),
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
});

export const userAdressSchema = z.object({
  street: z.string().min(2, "La rue est requise"),
  city: z.string().min(2, "La ville est requise"),
  state: z.string().min(2, "L'état est requis"),
  postalCode: z.string().min(2, "Le code postal est requis"),
  country: z.string().min(2, "Le pays est requis"),
});

//! ORDER
export const checkoutSchema = z.object({
  contactEmail: z.string().email("Veuillez entrer un email valide"),
  contactPhone: z
    .string()
    .min(10, "Le numéro de téléphone doit comporter au moins 10 caractères"),
  address: z.object({
    street: z.string().min(1, "La rue est obligatoire"),
    city: z.string().min(1, "La ville est obligatoire"),
    postalCode: z.string().min(1, "Le code postal est obligatoire"),
    country: z.string().min(1, "Le pays est obligatoire"),
  }),
  promoCode: z.string().optional(), // Le code promo est facultatif
  deliveryMethod: z.enum(["standard", "express"]),
});
