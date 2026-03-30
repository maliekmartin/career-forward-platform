"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  ResumeData,
  WizardStep,
  TemplateId,
  DEFAULT_RESUME_DATA,
  WorkExperience,
  Education,
  Certification,
  ContactInfo,
} from "../types/resume-types";

// State interface
interface ResumeBuilderState {
  // Resume data
  resumeId: string | null;
  resumeName: string;
  templateId: TemplateId;
  data: ResumeData;

  // Wizard state
  currentStep: WizardStep;
  isWizardOpen: boolean;

  // UI state
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  errors: Record<string, string[]>;
}

// Action types
type ResumeBuilderAction =
  | { type: "SET_RESUME_ID"; payload: string | null }
  | { type: "SET_RESUME_NAME"; payload: string }
  | { type: "SET_TEMPLATE"; payload: TemplateId }
  | { type: "SET_CONTACT_INFO"; payload: Partial<ContactInfo> }
  | { type: "SET_SUMMARY"; payload: string }
  | { type: "ADD_EXPERIENCE"; payload: WorkExperience }
  | { type: "UPDATE_EXPERIENCE"; payload: { id: string; data: Partial<WorkExperience> } }
  | { type: "DELETE_EXPERIENCE"; payload: string }
  | { type: "REORDER_EXPERIENCE"; payload: WorkExperience[] }
  | { type: "ADD_EDUCATION"; payload: Education }
  | { type: "UPDATE_EDUCATION"; payload: { id: string; data: Partial<Education> } }
  | { type: "DELETE_EDUCATION"; payload: string }
  | { type: "REORDER_EDUCATION"; payload: Education[] }
  | { type: "SET_SKILLS"; payload: string[] }
  | { type: "ADD_SKILL"; payload: string }
  | { type: "REMOVE_SKILL"; payload: string }
  | { type: "ADD_CERTIFICATION"; payload: Certification }
  | { type: "UPDATE_CERTIFICATION"; payload: { id: string; data: Partial<Certification> } }
  | { type: "DELETE_CERTIFICATION"; payload: string }
  | { type: "SET_CURRENT_STEP"; payload: WizardStep }
  | { type: "OPEN_WIZARD"; payload?: { resumeId?: string; templateId?: TemplateId } }
  | { type: "CLOSE_WIZARD" }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_LAST_SAVED"; payload: Date }
  | { type: "SET_ERRORS"; payload: Record<string, string[]> }
  | { type: "CLEAR_ERRORS" }
  | { type: "LOAD_RESUME"; payload: { id: string; name: string; templateId: TemplateId; data: ResumeData } }
  | { type: "RESET" }
  | { type: "MARK_SAVED" };

// Initial state
const initialState: ResumeBuilderState = {
  resumeId: null,
  resumeName: "Untitled Resume",
  templateId: "modern",
  data: DEFAULT_RESUME_DATA,
  currentStep: "contact",
  isWizardOpen: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  errors: {},
};

// Reducer
function resumeBuilderReducer(
  state: ResumeBuilderState,
  action: ResumeBuilderAction
): ResumeBuilderState {
  switch (action.type) {
    case "SET_RESUME_ID":
      return { ...state, resumeId: action.payload };

    case "SET_RESUME_NAME":
      return { ...state, resumeName: action.payload, hasUnsavedChanges: true };

    case "SET_TEMPLATE":
      return { ...state, templateId: action.payload, hasUnsavedChanges: true };

    case "SET_CONTACT_INFO":
      return {
        ...state,
        data: {
          ...state.data,
          contactInfo: { ...state.data.contactInfo, ...action.payload },
        },
        hasUnsavedChanges: true,
      };

    case "SET_SUMMARY":
      return {
        ...state,
        data: { ...state.data, summary: action.payload },
        hasUnsavedChanges: true,
      };

    case "ADD_EXPERIENCE":
      return {
        ...state,
        data: {
          ...state.data,
          experience: [...state.data.experience, action.payload],
        },
        hasUnsavedChanges: true,
      };

    case "UPDATE_EXPERIENCE":
      return {
        ...state,
        data: {
          ...state.data,
          experience: state.data.experience.map((exp) =>
            exp.id === action.payload.id
              ? { ...exp, ...action.payload.data }
              : exp
          ),
        },
        hasUnsavedChanges: true,
      };

    case "DELETE_EXPERIENCE":
      return {
        ...state,
        data: {
          ...state.data,
          experience: state.data.experience.filter(
            (exp) => exp.id !== action.payload
          ),
        },
        hasUnsavedChanges: true,
      };

    case "REORDER_EXPERIENCE":
      return {
        ...state,
        data: { ...state.data, experience: action.payload },
        hasUnsavedChanges: true,
      };

    case "ADD_EDUCATION":
      return {
        ...state,
        data: {
          ...state.data,
          education: [...state.data.education, action.payload],
        },
        hasUnsavedChanges: true,
      };

    case "UPDATE_EDUCATION":
      return {
        ...state,
        data: {
          ...state.data,
          education: state.data.education.map((edu) =>
            edu.id === action.payload.id
              ? { ...edu, ...action.payload.data }
              : edu
          ),
        },
        hasUnsavedChanges: true,
      };

    case "DELETE_EDUCATION":
      return {
        ...state,
        data: {
          ...state.data,
          education: state.data.education.filter(
            (edu) => edu.id !== action.payload
          ),
        },
        hasUnsavedChanges: true,
      };

    case "REORDER_EDUCATION":
      return {
        ...state,
        data: { ...state.data, education: action.payload },
        hasUnsavedChanges: true,
      };

    case "SET_SKILLS":
      return {
        ...state,
        data: { ...state.data, skills: action.payload },
        hasUnsavedChanges: true,
      };

    case "ADD_SKILL":
      if (state.data.skills.includes(action.payload)) return state;
      return {
        ...state,
        data: { ...state.data, skills: [...state.data.skills, action.payload] },
        hasUnsavedChanges: true,
      };

    case "REMOVE_SKILL":
      return {
        ...state,
        data: {
          ...state.data,
          skills: state.data.skills.filter((s) => s !== action.payload),
        },
        hasUnsavedChanges: true,
      };

    case "ADD_CERTIFICATION":
      return {
        ...state,
        data: {
          ...state.data,
          certifications: [...state.data.certifications, action.payload],
        },
        hasUnsavedChanges: true,
      };

    case "UPDATE_CERTIFICATION":
      return {
        ...state,
        data: {
          ...state.data,
          certifications: state.data.certifications.map((cert) =>
            cert.id === action.payload.id
              ? { ...cert, ...action.payload.data }
              : cert
          ),
        },
        hasUnsavedChanges: true,
      };

    case "DELETE_CERTIFICATION":
      return {
        ...state,
        data: {
          ...state.data,
          certifications: state.data.certifications.filter(
            (cert) => cert.id !== action.payload
          ),
        },
        hasUnsavedChanges: true,
      };

    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };

    case "OPEN_WIZARD":
      return {
        ...state,
        isWizardOpen: true,
        currentStep: "contact",
        resumeId: action.payload?.resumeId || null,
        templateId: action.payload?.templateId || "modern",
        data: DEFAULT_RESUME_DATA,
        resumeName: "Untitled Resume",
        hasUnsavedChanges: false,
      };

    case "CLOSE_WIZARD":
      return { ...state, isWizardOpen: false };

    case "SET_SAVING":
      return { ...state, isSaving: action.payload };

    case "SET_LAST_SAVED":
      return { ...state, lastSaved: action.payload, hasUnsavedChanges: false };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    case "CLEAR_ERRORS":
      return { ...state, errors: {} };

    case "LOAD_RESUME":
      return {
        ...state,
        resumeId: action.payload.id,
        resumeName: action.payload.name,
        templateId: action.payload.templateId,
        data: action.payload.data,
        isWizardOpen: true,
        currentStep: "contact",
        hasUnsavedChanges: false,
      };

    case "MARK_SAVED":
      return { ...state, hasUnsavedChanges: false, lastSaved: new Date() };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

// Context interface
interface ResumeBuilderContextValue {
  state: ResumeBuilderState;
  dispatch: React.Dispatch<ResumeBuilderAction>;

  // Helper actions
  openWizard: (options?: { resumeId?: string; templateId?: TemplateId }) => void;
  closeWizard: () => void;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveResume: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
  updateContactInfo: (data: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: WorkExperience) => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setSkills: (skills: string[]) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  setTemplate: (templateId: TemplateId) => void;
  setResumeName: (name: string) => void;
}

// Context
const ResumeBuilderContext = createContext<ResumeBuilderContextValue | null>(
  null
);

// Step order for navigation
const STEP_ORDER: WizardStep[] = [
  "contact",
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "review",
];

// Provider component
export function ResumeBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(resumeBuilderReducer, initialState);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Track mount state for cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel any in-flight requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Save function with proper closure handling - uses refs to get latest state
  const saveResumeToServer = useCallback(async () => {
    // Abort any previous save request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    dispatch({ type: "SET_SAVING", payload: true });

    try {
      const endpoint = state.resumeId
        ? `/api/resume/${state.resumeId}`
        : "/api/resume";
      const method = state.resumeId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.resumeName,
          templateId: state.templateId,
          content: state.data,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to save resume");
      }

      const result = await response.json();

      // Only update state if still mounted
      if (isMountedRef.current) {
        if (!state.resumeId && result.id) {
          dispatch({ type: "SET_RESUME_ID", payload: result.id });
        }
        dispatch({ type: "MARK_SAVED" });
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Failed to save resume:", error);
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    }
  }, [state.resumeId, state.resumeName, state.templateId, state.data]);

  // Auto-save effect with proper dependencies
  useEffect(() => {
    if (state.hasUnsavedChanges && state.resumeId) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        saveResumeToServer();
      }, 2000); // 2 second debounce
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [state.hasUnsavedChanges, state.resumeId, saveResumeToServer]);

  const openWizard = useCallback(
    (options?: { resumeId?: string; templateId?: TemplateId }) => {
      dispatch({ type: "OPEN_WIZARD", payload: options });
    },
    []
  );

  const closeWizard = useCallback(() => {
    dispatch({ type: "CLOSE_WIZARD" });
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      dispatch({
        type: "SET_CURRENT_STEP",
        payload: STEP_ORDER[currentIndex + 1],
      });
    }
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      dispatch({
        type: "SET_CURRENT_STEP",
        payload: STEP_ORDER[currentIndex - 1],
      });
    }
  }, [state.currentStep]);

  const saveResume = useCallback(async () => {
    await saveResumeToServer();
  }, [saveResumeToServer]);

  const loadResume = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/resume/${id}`);
      if (!response.ok) {
        throw new Error("Failed to load resume");
      }
      const resume = await response.json();
      dispatch({
        type: "LOAD_RESUME",
        payload: {
          id: resume.id,
          name: resume.name,
          templateId: resume.templateId as TemplateId,
          data: resume.content,
        },
      });
    } catch (error) {
      console.error("Failed to load resume:", error);
      throw error;
    }
  }, []);

  const updateContactInfo = useCallback((data: Partial<ContactInfo>) => {
    dispatch({ type: "SET_CONTACT_INFO", payload: data });
  }, []);

  const updateSummary = useCallback((summary: string) => {
    dispatch({ type: "SET_SUMMARY", payload: summary });
  }, []);

  const addExperience = useCallback((exp: WorkExperience) => {
    dispatch({ type: "ADD_EXPERIENCE", payload: exp });
  }, []);

  const updateExperience = useCallback(
    (id: string, data: Partial<WorkExperience>) => {
      dispatch({ type: "UPDATE_EXPERIENCE", payload: { id, data } });
    },
    []
  );

  const deleteExperience = useCallback((id: string) => {
    dispatch({ type: "DELETE_EXPERIENCE", payload: id });
  }, []);

  const addEducation = useCallback((edu: Education) => {
    dispatch({ type: "ADD_EDUCATION", payload: edu });
  }, []);

  const updateEducation = useCallback(
    (id: string, data: Partial<Education>) => {
      dispatch({ type: "UPDATE_EDUCATION", payload: { id, data } });
    },
    []
  );

  const deleteEducation = useCallback((id: string) => {
    dispatch({ type: "DELETE_EDUCATION", payload: id });
  }, []);

  const addSkill = useCallback((skill: string) => {
    dispatch({ type: "ADD_SKILL", payload: skill });
  }, []);

  const removeSkill = useCallback((skill: string) => {
    dispatch({ type: "REMOVE_SKILL", payload: skill });
  }, []);

  const setSkills = useCallback((skills: string[]) => {
    dispatch({ type: "SET_SKILLS", payload: skills });
  }, []);

  const addCertification = useCallback((cert: Certification) => {
    dispatch({ type: "ADD_CERTIFICATION", payload: cert });
  }, []);

  const updateCertification = useCallback(
    (id: string, data: Partial<Certification>) => {
      dispatch({ type: "UPDATE_CERTIFICATION", payload: { id, data } });
    },
    []
  );

  const deleteCertification = useCallback((id: string) => {
    dispatch({ type: "DELETE_CERTIFICATION", payload: id });
  }, []);

  const setTemplate = useCallback((templateId: TemplateId) => {
    dispatch({ type: "SET_TEMPLATE", payload: templateId });
  }, []);

  const setResumeName = useCallback((name: string) => {
    dispatch({ type: "SET_RESUME_NAME", payload: name });
  }, []);

  const value: ResumeBuilderContextValue = {
    state,
    dispatch,
    openWizard,
    closeWizard,
    goToStep,
    nextStep,
    prevStep,
    saveResume,
    loadResume,
    updateContactInfo,
    updateSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    removeSkill,
    setSkills,
    addCertification,
    updateCertification,
    deleteCertification,
    setTemplate,
    setResumeName,
  };

  return (
    <ResumeBuilderContext.Provider value={value}>
      {children}
    </ResumeBuilderContext.Provider>
  );
}

// Hook for consuming context
export function useResumeBuilder() {
  const context = useContext(ResumeBuilderContext);
  if (!context) {
    throw new Error(
      "useResumeBuilder must be used within a ResumeBuilderProvider"
    );
  }
  return context;
}
