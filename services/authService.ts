// --- MOCK AUTHENTICATION SERVICE ---
// This file simulates a real authentication backend like Firebase.
// It uses localStorage to persist user sessions.

export interface User {
  uid: string;
  email: string;
  fullName: string;
}

const FAKE_LATENCY = 500; // milliseconds
const USER_STORAGE_KEY = 'intellicompress_user';
const USERS_DB_KEY = 'intellicompress_users_db';

// Simulate a user database (in a real app, this is on a server)
const getUsersDatabase = (): Map<string, { email: string; passwordHash: string; fullName: string }> => {
  try {
    const db = localStorage.getItem(USERS_DB_KEY);
    return db ? new Map(JSON.parse(db)) : new Map();
  } catch {
    return new Map();
  }
};

const saveUsersDatabase = (db: Map<string, { email: string; passwordHash: string; fullName: string }>) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(Array.from(db.entries())));
};

export const signUp = (email: string, password: string, fullName: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const db = getUsersDatabase();

      if (!fullName.trim()) {
        return reject(new Error('Full name is required.'));
      }
      if (password.length < 6) {
        return reject(new Error('Password must be at least 6 characters.'));
      }

      // Check if user already exists
      for (const user of db.values()) {
        if (user.email === email) {
          return reject(new Error('An account with this email already exists.'));
        }
      }

      const uid = `uid_${Date.now()}`;
      const newUser: User = { uid, email, fullName };
      
      db.set(email, { email, passwordHash: `hashed_${password}`, fullName });
      saveUsersDatabase(db);
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      // Notify listeners about the auth state change
      window.dispatchEvent(new Event('authChange'));
      
      resolve(newUser);
    }, FAKE_LATENCY);
  });
};

export const logIn = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const db = getUsersDatabase();
      const storedUser = db.get(email);

      if (storedUser && storedUser.passwordHash === `hashed_${password}`) {
        const uid = `uid_${Object.keys(db).findIndex(e => e === email)}_${Date.now()}`;
        const user: User = { uid, email, fullName: storedUser.fullName };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        // Notify listeners about the auth state change
        window.dispatchEvent(new Event('authChange'));

        resolve(user);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, FAKE_LATENCY);
  });
};

export const logOut = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(USER_STORAGE_KEY);
      // Notify listeners about the auth state change
      window.dispatchEvent(new Event('authChange'));
      resolve();
    }, FAKE_LATENCY / 2);
  });
};

/**
 * A hook-like function that listens for changes in authentication state.
 * In a real Firebase app, this would be `onAuthStateChanged(auth, callback)`.
 * Here, we use a custom event on the window object to simulate this.
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  const handleAuthChange = () => {
    try {
      const userJson = localStorage.getItem(USER_STORAGE_KEY);
      const user = userJson ? JSON.parse(userJson) : null;
      callback(user);
    } catch {
      callback(null);
    }
  };

  // Listen for our custom event
  window.addEventListener('authChange', handleAuthChange);

  // Immediately call it once to get the initial state
  handleAuthChange();

  // Return a cleanup function to remove the listener
  return () => {
    window.removeEventListener('authChange', handleAuthChange);
  };
};