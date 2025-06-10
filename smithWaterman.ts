import { calculateNucleotideScore, GapPenalty, GAP_PENALTIES, calculateAlignmentStats, AlignmentStats } from './dnaUtils';

export interface LocalAlignmentResult {
  alignedSeq1: string;
  alignedSeq2: string;
  score: number;
  stats: AlignmentStats;
}

export function smithWaterman(
  seq1: string,
  seq2: string,
  gapPenalty: GapPenalty = GAP_PENALTIES.DEFAULT
): LocalAlignmentResult {
  const m = seq1.length;
  const n = seq2.length;

  // Initialize matrices
  const scoreMatrix: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const traceback: ("D" | "U" | "L" | "0")[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill("0"));

  let maxScore = 0;
  let maxPos = [0, 0];

  // Fill the scoring matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = calculateNucleotideScore(seq1[i - 1], seq2[j - 1]);
      const diag = scoreMatrix[i - 1][j - 1] + matchScore;
      
      // Affine gap penalty
      const up = scoreMatrix[i - 1][j] + (traceback[i - 1][j] === "U" ? gapPenalty.extend : gapPenalty.open);
      const left = scoreMatrix[i][j - 1] + (traceback[i][j - 1] === "L" ? gapPenalty.extend : gapPenalty.open);

      // Smith-Waterman allows for 0 (no alignment)
      scoreMatrix[i][j] = Math.max(0, diag, up, left);

      // Update traceback matrix
      if (scoreMatrix[i][j] === 0) {
        traceback[i][j] = "0";
      } else if (scoreMatrix[i][j] === diag) {
        traceback[i][j] = "D";
      } else if (scoreMatrix[i][j] === up) {
        traceback[i][j] = "U";
      } else {
        traceback[i][j] = "L";
      }

      // Track maximum score position
      if (scoreMatrix[i][j] > maxScore) {
        maxScore = scoreMatrix[i][j];
        maxPos = [i, j];
      }
    }
  }

  // Traceback from maximum score position
  let aligned1 = "";
  let aligned2 = "";
  let [i, j] = maxPos;

  while (i > 0 && j > 0 && scoreMatrix[i][j] !== 0) {
    const dir = traceback[i][j];
    if (dir === "D") {
      aligned1 = seq1[i - 1] + aligned1;
      aligned2 = seq2[j - 1] + aligned2;
      i--;
      j--;
    } else if (dir === "U") {
      aligned1 = seq1[i - 1] + aligned1;
      aligned2 = "-" + aligned2;
      i--;
    } else if (dir === "L") {
      aligned1 = "-" + aligned1;
      aligned2 = seq2[j - 1] + aligned2;
      j--;
    }
  }

  const stats = calculateAlignmentStats(aligned1, aligned2);

  return {
    alignedSeq1: aligned1,
    alignedSeq2: aligned2,
    score: maxScore,
    stats
  };
}
