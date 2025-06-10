import { GAP_PENALTIES, calculateAlignmentStats, AlignmentStats } from './dnaUtils';

export interface AlignmentResult {
  alignedSeq1: string;
  alignedSeq2: string;
  score: number;
  stats: AlignmentStats;
}

export function needlemanWunsch(seq1: string, seq2: string, gapPenalty: typeof GAP_PENALTIES.DEFAULT): AlignmentResult {
  const m = seq1.length;
  const n = seq2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  const traceback: string[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(''));

  // Initialize first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i * gapPenalty.open;
    traceback[i][0] = 'up';
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j * gapPenalty.open;
    traceback[0][j] = 'left';
  }

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = dp[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? 1 : -1);
      const del = dp[i - 1][j] + gapPenalty.open;
      const ins = dp[i][j - 1] + gapPenalty.open;

      dp[i][j] = Math.max(match, del, ins);

      if (dp[i][j] === match) {
        traceback[i][j] = 'diag';
      } else if (dp[i][j] === del) {
        traceback[i][j] = 'up';
      } else {
        traceback[i][j] = 'left';
      }
    }
  }

  // Traceback
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (traceback[i][j] === 'diag') {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      i--;
      j--;
    } else if (traceback[i][j] === 'up') {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } else {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      j--;
    }
  }

  // Calculate statistics
  const stats = calculateAlignmentStats(alignedSeq1, alignedSeq2);

  return {
    alignedSeq1,
    alignedSeq2,
    score: dp[m][n],
    stats
  };
}

export function smithWaterman(seq1: string, seq2: string, gapPenalty: typeof GAP_PENALTIES.DEFAULT): AlignmentResult {
  const m = seq1.length;
  const n = seq2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  const traceback: string[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(''));

  let maxScore = 0;
  let maxI = 0;
  let maxJ = 0;

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = dp[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? 1 : -1);
      const del = dp[i - 1][j] + gapPenalty.open;
      const ins = dp[i][j - 1] + gapPenalty.open;

      dp[i][j] = Math.max(0, match, del, ins);

      if (dp[i][j] > maxScore) {
        maxScore = dp[i][j];
        maxI = i;
        maxJ = j;
      }

      if (dp[i][j] === match) {
        traceback[i][j] = 'diag';
      } else if (dp[i][j] === del) {
        traceback[i][j] = 'up';
      } else if (dp[i][j] === ins) {
        traceback[i][j] = 'left';
      } else {
        traceback[i][j] = 'end';
      }
    }
  }

  // Traceback
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  let i = maxI;
  let j = maxJ;

  while (i > 0 && j > 0 && dp[i][j] > 0) {
    if (traceback[i][j] === 'diag') {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      i--;
      j--;
    } else if (traceback[i][j] === 'up') {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } else if (traceback[i][j] === 'left') {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      j--;
    } else {
      break;
    }
  }

  // Calculate statistics
  const stats = calculateAlignmentStats(alignedSeq1, alignedSeq2);

  return {
    alignedSeq1,
    alignedSeq2,
    score: maxScore,
    stats
  };
} 