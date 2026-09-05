export type StepComponentProps = {
  onNext: (data?: any) => void;
  onBack: () => void;
};

export type Step = {
  title: string;
  description: string;
  component?: React.ComponentType<StepComponentProps> | null;
};
