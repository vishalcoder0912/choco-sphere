import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, LockKeyhole, UserRound, X } from "lucide-react";
import styles from "./AuthModal.module.css";

type AuthMode = "login" | "register";

interface AuthModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: { mode: AuthMode; name?: string; email: string; password: string }) => Promise<void> | void;
}

export const AuthModal = ({ open, loading, onClose, onSubmit }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      mode,
      name: mode === "register" ? name : undefined,
      email,
      password,
    });
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onClose} aria-label="Close authentication form">
          <X size={18} />
        </button>

        <div className={styles.header}>
          <span className={styles.kicker}>
            <LockKeyhole size={14} />
            Secure Access
          </span>
          <h2 className={styles.title}>
            {mode === "login" ? "Welcome back to ChocoVerse" : "Create your ChocoVerse account"}
          </h2>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Sign in to track orders and checkout faster."
              : "Register once and keep your cart, orders, and premium picks in sync."}
          </p>
        </div>

        <div className={styles.toggle}>
          <button
            className={mode === "login" ? styles.toggleActive : styles.toggleButton}
            onClick={() => setMode("login")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={mode === "register" ? styles.toggleActive : styles.toggleButton}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "register" && (
            <label className={styles.field}>
              <span className={styles.label}>Full Name</span>
              <div className={styles.inputWrap}>
                <UserRound size={16} />
                <input
                  className={styles.input}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Vishal Kumar"
                  required
                />
              </div>
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>@</span>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <div className={styles.inputWrap}>
              <LockKeyhole size={16} />
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>
          </label>

          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? <LoaderCircle className={styles.spinner} size={18} /> : null}
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
