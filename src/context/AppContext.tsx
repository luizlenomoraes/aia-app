import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Infraction, CalculationState, OffenderData } from '../types';

interface AppContextType {
  selectedInfraction: Infraction | null;
  setSelectedInfraction: (inf: Infraction | null) => void;
  calculation: CalculationState;
  setCalculation: React.Dispatch<React.SetStateAction<CalculationState>>;
  offender: OffenderData;
  setOffender: React.Dispatch<React.SetStateAction<OffenderData>>;
  reportImages: string[];
  setReportImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const defaultCalculation: CalculationState = {
  voluntariedade: 0,
  meioAmbiente: 0,
  saudePublica: 0,
  tipoInfracional: 0,
  categoriaInfrator: 0,
  valorReferencia: 0,
  percentualMaximo: 0,
  agravantes: [],
  atenuantes: [],
  quantidade: 0,
  valorExcedente: 0,
  valorFinal: 0,
  sancoes: []
};

const defaultOffender: OffenderData = {
  nome: '',
  cpfcnpj: '',
  local: '',
  data: new Date().toISOString().split('T')[0],
  municipio: '',
  coord: ''
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedInfraction, setSelectedInfraction] = useState<Infraction | null>(null);
  const [calculation, setCalculation] = useState<CalculationState>(defaultCalculation);
  const [offender, setOffender] = useState<OffenderData>(defaultOffender);
  const [reportImages, setReportImages] = useState<string[]>([]);

  return (
    <AppContext.Provider value={{
      selectedInfraction,
      setSelectedInfraction,
      calculation,
      setCalculation,
      offender,
      setOffender,
      reportImages,
      setReportImages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
