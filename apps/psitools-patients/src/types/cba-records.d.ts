export interface CbaRecord {
  response: Record<string, string>;
  scores: {
    ansia: number;
    depressione: number;
    cambiamento: number;
    disagio: number;
    benessere: number;
  };
}
