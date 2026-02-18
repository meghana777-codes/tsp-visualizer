export interface City {
  id: number;
  name: string;
  x: number;
  y: number;
}

export type TSPStep =
  | {
      type: "CONSIDER";
      currentCity: number;
      nextCity: number;
      path: number[];
      distance: number;
    }
  | {
      type: "VISIT";
      currentCity: number;
      nextCity?: number;
      path: number[];
      distance: number;
    }
  | {
      type: "COMPLETE";
      currentCity: number;
      path: number[];
      distance: number;
    };
