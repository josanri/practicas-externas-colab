"use server";

import ofertas from "../public/ofertas.json";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import clientPromise from "../lib/mongodb";
import { MongoServerError } from "mongodb";
import { toast } from "react-hot-toast";

export default async function uploadPreferences(form: FormData) {
  const ids = ofertas.map((item) => item.id);
  const entries = Object.fromEntries(form.entries());

  const formSchema = {
    rank: z.coerce.number().min(1).max(132)
  } as any;

  for (let i = 0; i < 48; i++) {
    formSchema["preference_" + (i + 1)] = z.coerce
      .number()
      .refine((val) => ids.includes(val), { message: `La oferta no existe` });
  }
  const validatePreferences = z.object(formSchema);

  try {
    const { rank, ...preferences } = validatePreferences.parse(entries);
    
    const preferencesFiltered = Object.values(preferences).filter((item) => item !== 0)
    if (preferencesFiltered.length === 0) {
      preferencesFiltered.push(0);
    }

    const data = {
      rank,
      verified: false,
      preferences: preferencesFiltered,
    };

    if (new Set(data.preferences).size !== data.preferences.length) {
        return { error: "No se pueden repetir las preferencias" };
    }

    const client = await clientPromise;
    const db = client.db("practicas");
    const collection = db.collection("preferences");
    await collection.insertOne(data);

    revalidatePath("/data");
    return { success: "Datos subidos correctamente" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    } else if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return { error: "Los datos de ese puesto ya existe en la base de datos" };
      } else {
        return { error: "Error desconocido en la base de datos" };
      }
    } else {
      return { error: "Error desconocido" };
    }
  }
}
