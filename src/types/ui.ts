// Tipos de componentes UI

export type TabType = "general" | "location" | "timezone" | "statistics";

export interface TabItem {
  id: TabType;
  label: string;
  icon?: React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

// Tema
export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

// Animaciones
export interface AnimationVariant {
  hidden: object;
  visible: object;
  exit?: object;
}
