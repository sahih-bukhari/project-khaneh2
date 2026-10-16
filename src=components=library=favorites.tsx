import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { parseFavorites } from "@/lib/catalog";
const KEY = "proje-khana-favorites";
const FavoritesContext = createContext<{
  ids: string[];
  toggle: (id: string) => void;
  ready: boolean;
  storageError: boolean;
}>({ ids: [], toggle: () => {}, ready: false, storageError: false });
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      setIds(parseFavorites(localStorage.getItem(KEY)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  const toggle = (id: string) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        setStorageError(true);
      }
      return next;
    });
  };
  return (
    <FavoritesContext.Provider value={{ ids, toggle, ready, storageError }}>
      {children}
    </FavoritesContext.Provider>
  );
}
export function useFavorites() {
  return useContext(FavoritesContext);
}
