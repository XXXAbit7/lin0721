/// <reference types="vite/client" />

declare module 'virtual:portfolio-data' {
  export interface Work {
    id: string;
    title: string;
    category: string;
    src: string;
  }

  export const bannerItems: Work[];
  export const journalCovers: Work[];
  export const medicalIllustrations: Work[];
  export const materialViz: Work[];
  export const mechanismDiagrams: Work[];
}