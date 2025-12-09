export type InputMethod = 'file' | 'text';

export interface CoverLetterRequest {
  jdContent: string;
  resumeContent: string;
  instructions: string;
  candidateName: string;
}

export interface GeneratedResponse {
  content: string;
}

export interface InputCardProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholderText: string;
  allowFileUpload?: boolean;
  heightClass?: string;
  onClose?: () => void;
}