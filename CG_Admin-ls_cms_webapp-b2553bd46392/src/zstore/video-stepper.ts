import create from 'zustand';

interface videoPayloadInterface {
  videoTitle: string;
  domain: string;
  subDomain: string;
  ages: number[];
  vendorId: number;
  themeId: number;
  themeName: string;
  subThemeId: number;
  subThemeName: string;
  videoLength: number;
  videoOrder: number;
  minVersion: string;
  startEnd: number[];
  videoFile?: File;
  iconFile?: File;
}
interface videoStepperState {
  videoPayload: videoPayloadInterface;
  formValidation: {
    videoDetail: boolean;
    theme: boolean;
    meta: boolean;
    tech: boolean;
  }
  setPayload: (key: string, value: string | number | boolean | number[] | File) => void;
  setValidation: (key: string, value: boolean) => void;
  resetPayload: () => void;
}

const defaultVideoPayload: videoPayloadInterface = {
  videoTitle: "",
  domain: "",
  subDomain: "",
  ages: [3, 17],
  vendorId: 0,
  videoLength: 0,
  themeId: 0,
  subThemeId: 0,
  themeName: "",
  subThemeName: "",
  videoOrder: 0,
  minVersion: "",
  startEnd: [0, 0],
  videoFile: undefined,
  iconFile: undefined
}

const useStore = create<videoStepperState>((set) => ({
  videoPayload: {
    videoTitle: "",
    domain: "",
    subDomain: "",
    ages: [3, 17],
    vendorId: 0,
    videoLength: 0,
    themeId: 0,
    subThemeId: 0,
    themeName: "",
    subThemeName: "",
    videoOrder: 0,
    minVersion: "",
    startEnd: [0, 0],
  },
  formValidation: {
    videoDetail: false,
    theme: false,
    meta: false,
    tech: false
  },
  setPayload: (key: string, value: string | number | boolean | number[] | File) => {
    let newPayload: any = {};
    newPayload[key] = value;
    set((state: any) => {
      return Object.assign(state.videoPayload, newPayload)
    });
  },
  setValidation: (key: string, value: boolean) => {
    set((state: any) => {
      state.formValidation[key] = value
    });
  },
  resetPayload: () => {
    set((state) => {
      state.videoPayload = defaultVideoPayload
    })
  }
}));

export default useStore;