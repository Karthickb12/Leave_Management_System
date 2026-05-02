import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebase";

export type UserRole = 'STUDENT' | 'ADVISOR' | 'HOD' | 'PRINCIPAL' | 'ADMIN';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, name: string, role: UserRole, department: string, class_name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const db = getFirestore();

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch Role from Firestore
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setRole(userDoc.data().role as UserRole);
                    } else {
                        console.error("User document not found in Firestore");
                        setRole('STUDENT'); // Fallback (or handle error)
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    // If role lookup fails, fall back to a default student role
                    setRole('STUDENT');
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signup = async (email: string, pass: string, name: string, selectedRole: UserRole, department: string, class_name: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        // Create User Doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: name,
            role: selectedRole,
            department: department || "General",
            class_name: class_name || "",
            createdAt: serverTimestamp()
        });

        // Update local state immediately to avoid race condition
        setRole(selectedRole);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, signup, logout }}>
            {loading ? (
                <div style={{
                          minHeight: '100vh',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#020617',
                          gap: '1.25rem',
                      }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 0 0 rgba(99,102,241,0.5)',
                            animation: 'pulse-ring 2s ease-out infinite',
                        }}>
                          <span style={{ fontSize: '1.75rem' }}>🎓</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>EduFlow</p>
                        <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>Connecting to College System...</p>
                      </div>
                    </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
