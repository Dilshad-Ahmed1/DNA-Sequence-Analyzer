import { calculateNucleotideScore, GapPenalty, GAP_PENALTIES, calculateAlignmentStats, AlignmentStats } from './dnaUtils';

export interface AlignmentResult {
  alignedSeq1: string;
  alignedSeq2: string;
  score: number;
  stats: AlignmentStats;
}

export function needlemanWunsch(
  seq1: string,
  seq2: string,
  gapPenalty: GapPenalty = GAP_PENALTIES.DEFAULT
): AlignmentResult {
  const m = seq1.length;
  const n = seq2.length;

  // Initialize matrices
  const scoreMatrix: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const traceback: ("D" | "U" | "L")[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill("D"));

  // Initialize first row and column with gap penalties
  for (let i = 0; i <= m; i++) {
    scoreMatrix[i][0] = i * gapPenalty.open;
    traceback[i][0] = "U";
  }
  for (let j = 0; j <= n; j++) {
    scoreMatrix[0][j] = j * gapPenalty.open;
    traceback[0][j] = "L";
  }
  traceback[0][0] = "D";

  // Fill the scoring matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = calculateNucleotideScore(seq1[i - 1], seq2[j - 1]);
      const diag = scoreMatrix[i - 1][j - 1] + matchScore;
      
      // Affine gap penalty
      const up = scoreMatrix[i - 1][j] + (traceback[i - 1][j] === "U" ? gapPenalty.extend : gapPenalty.open);
      const left = scoreMatrix[i][j - 1] + (traceback[i][j - 1] === "L" ? gapPenalty.extend : gapPenalty.open);

      scoreMatrix[i][j] = Math.max(diag, up, left);

      // Update traceback matrix
      if (scoreMatrix[i][j] === diag) {
        traceback[i][j] = "D";
      } else if (scoreMatrix[i][j] === up) {
        traceback[i][j] = "U";
      } else {
        traceback[i][j] = "L";
      }
    }
  }

  // Traceback to get the alignment
  let aligned1 = "";
  let aligned2 = "";
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i === 0) {
      aligned1 = "-" + aligned1;
      aligned2 = seq2[j - 1] + aligned2;
      j--;
    } else if (j === 0) {
      aligned1 = seq1[i - 1] + aligned1;
      aligned2 = "-" + aligned2;
      i--;
    } else {
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
      } else {
        aligned1 = "-" + aligned1;
        aligned2 = seq2[j - 1] + aligned2;
        j--;
      }
    }
  }

  const stats = calculateAlignmentStats(aligned1, aligned2);

  return {
    alignedSeq1: aligned1,
    alignedSeq2: aligned2,
    score: scoreMatrix[m][n],
    stats
  };
}
