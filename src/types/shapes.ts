// src/types/shapes.ts

export type Point = {
  x: number;
  y: number;
};

export type Shape =
  | {
      id: string;
      type: "line";
      points: number[];
      strokeColor: string;
      strokeWidth: number;
    }
  | {
      id: string;
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      strokeColor: string;
      strokeWidth: number;
      fillColor: string;
    }
  | {
      id: string;
      type: "circle";
      x: number;
      y: number;
      radius: number;
      strokeColor: string;
      strokeWidth: number;
      fillColor: string;
    };
