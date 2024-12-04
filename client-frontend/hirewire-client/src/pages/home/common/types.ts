export interface LaboralExperience {
  id: string;
  endDate: Date;
  salary: number;
  startDate: Date;
  company: string;
  position: string;
}

export enum EducationLevel {
  BACHELOR = "BACHELOR", // Grado
  POSTGRADUATE = "POSTGRADUATE", // Post-grado
  MASTERS = "MASTERS", // Maestría
  DOCTORATE = "DOCTORATE", // Doctorado
  TECHNICAL = "TECHNICAL", // Técnico
  MANAGEMENT = "MANAGEMENT", // Gestión
}

export interface Education {
  id: string;
  endDate: Date;
  startDate: Date;
  description: string;
  institution: string;
  level: EducationLevel;
}

export interface Skill {
  id: string;
  description: string;
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Position {
  id: string;
  name: string | null;
  state: boolean;
  minSalary: number;
  maxSalary: number;
  riskLevel: RiskLevel;
  available: boolean;
  description: string | null;
}
