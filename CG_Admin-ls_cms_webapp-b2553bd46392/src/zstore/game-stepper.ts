import create from 'zustand';

interface gamePayloadInterface {
  gameTitle: string;
  domain: string;
  subDomain: string;
  ages: number[];
  themeId: number;
  themeName: string;
  subThemeId: number;
  subThemeName: string;
  isPortrait: boolean;
  gameOrder: number;
  minVersion: string;
  gameFile?: File;
  iconFile?: File;
  loadTime: string;
  searchTag?: string,
  viewTag?: string,
  isHtml?: boolean
};
interface gameStepperState {
  gamePayload: gamePayloadInterface;
  formValidation: {
    gameDetail: boolean;
    theme: boolean;
    meta: boolean;
    tech: boolean;
  }
  setPayload: (key: string, value: string | number | boolean | number[] | File) => void;
  setValidation: (key: string, value: boolean) => void;
  resetPayload: () => void;
}

const defaultGamePayload: gamePayloadInterface = {
  gameTitle: '',
  domain: '',
  subDomain: '',
  ages: [3, 17],
  themeId: 0,
  themeName: '',
  subThemeId: 0,
  subThemeName: '',
  isPortrait: false,
  gameOrder: 0,
  minVersion: '',
  gameFile: undefined,
  iconFile: undefined,
  loadTime: '',
  searchTag: '',
  viewTag: '',
  isHtml: true
};

const useStore = create<gameStepperState>((set: any) => ({
  gamePayload: {
    gameTitle: "",
    domain: "",
    subDomain: "",
    ages: [3, 17],
    vendorId: 0,
    themeId: 0,
    subThemeId: 0,
    themeName: "",
    subThemeName: "",
    isPortrait: false,
    gameOrder: 0,
    minVersion: "",
    loadTime: "",
    searchTag: "",
    viewTag: "",
    isHtml: true
  },
  formValidation: {
    gameDetail: false,
    theme: false,
    meta: false,
    tech: false
  },
  setPayload: (key: string, value: string | number | boolean | number[] | File) => {
    let newPayload: any = {};
    newPayload[key] = value;
    set((state: any) => {
      return Object.assign(state.gamePayload, newPayload)
    });
  },
  setValidation: (key: string, value: boolean) => {
    set((state: any) => {
      state.formValidation[key] = value
    });
  },
  resetPayload: () => {
    set((state: any) => {
      state.gamePayload = defaultGamePayload;
      return state;
    });
  }
}));

export default useStore;
