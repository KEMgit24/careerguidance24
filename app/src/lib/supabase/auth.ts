import { supabase } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  niveau?: string;
  interets?: string[];
  hobbies?: string[];
  matieres?: string[];
  competences?: string[];
  environnement?: string[];
};

// ── Sign Up ──────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  firstName: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName } },
  });

  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: "Erreur lors de l'inscription" };

  // Créer le profil dans la table profiles
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    first_name: firstName,
    role: "student",
  });

  if (profileError) console.warn("Profile creation error:", profileError.message);

  return {
    user: { id: data.user.id, email, firstName },
    error: null,
  };
}

// ── Sign In ──────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null, error: "Email ou mot de passe incorrect" };
  if (!data.user) return { user: null, error: "Erreur de connexion" };

  // Récupérer le profil complet
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      niveau: profile?.niveau,
      interets: profile?.interets,
      hobbies: profile?.hobbies,
      matieres: profile?.matieres,
      competences: profile?.competences,
      environnement: profile?.environnement,
    },
    error: null,
  };
}

// ── Sign Out ─────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// ── Get current session ──────────────────────────────────────
export async function getSession(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    firstName: profile?.first_name,
    lastName: profile?.last_name,
    niveau: profile?.niveau,
    interets: profile?.interets,
    hobbies: profile?.hobbies,
    matieres: profile?.matieres,
    competences: profile?.competences,
    environnement: profile?.environnement,
  };
}

// ── Save profile after onboarding ───────────────────────────
export async function saveProfile(
  userId: string,
  data: { 
    niveau?: string; 
    interets?: string[]; 
    hobbies?: string[];
    matieres?: string[];
    competences?: string[];
    environnement?: string[];
  }
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("profiles")
    .update({ 
      niveau: data.niveau, 
      interets: data.interets, 
      hobbies: data.hobbies,
      matieres: data.matieres,
      competences: data.competences,
      environnement: data.environnement
    })
    .eq("id", userId);

  return { error: error?.message ?? null };
}
