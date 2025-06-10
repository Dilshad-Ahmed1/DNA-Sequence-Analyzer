export function naiveStringMatching(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) {
      matches.push(i);
    }
  }

  return matches;
}

export function kmpSearch(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  const lps = computeLPS(pattern);

  let i = 0; // index for text
  let j = 0; // index for pattern

  while (i < n) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === m) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return matches;
}

function computeLPS(pattern: string): number[] {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

export function boyerMooreSearch(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  const badChar = computeBadChar(pattern);
  const goodSuffix = computeGoodSuffix(pattern);

  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
    }

    if (j < 0) {
      matches.push(s);
      s += (m > 1) ? goodSuffix[0] : 1;
    } else {
      const badCharShift = Math.max(1, j - (badChar[text[s + j]] || -1));
      const goodSuffixShift = goodSuffix[j];
      s += Math.max(badCharShift, goodSuffixShift);
    }
  }

  return matches;
}

function computeBadChar(pattern: string): Record<string, number> {
  const badChar: Record<string, number> = {};
  const m = pattern.length;

  // Initialize all characters to -1
  for (let i = 0; i < m; i++) {
    badChar[pattern[i]] = i;
  }

  return badChar;
}

function computeGoodSuffix(pattern: string): number[] {
  const m = pattern.length;
  const goodSuffix = new Array(m).fill(0);
  const suffix = new Array(m).fill(0);

  // Case 1: Exact match
  let i = m;
  let j = m + 1;
  suffix[i] = j;

  while (i > 0) {
    while (j <= m && pattern[i - 1] !== pattern[j - 1]) {
      if (goodSuffix[j] === 0) {
        goodSuffix[j] = j - i;
      }
      j = suffix[j];
    }
    i--;
    j--;
    suffix[i] = j;
  }

  // Case 2: Prefix of pattern matches suffix of pattern
  j = suffix[0];
  for (i = 0; i <= m; i++) {
    if (goodSuffix[i] === 0) {
      goodSuffix[i] = j;
    }
    if (i === j) {
      j = suffix[j];
    }
  }

  // Ensure minimum shift of 1
  for (i = 0; i < m; i++) {
    if (goodSuffix[i] === 0) {
      goodSuffix[i] = 1;
    }
  }

  return goodSuffix;
}

export function rabinKarpSearch(text: string, pattern: string): number[] {
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  const d = 256; // Number of characters in the input alphabet
  const q = 101; // A prime number
  let p = 0; // Hash value for pattern
  let t = 0; // Hash value for text
  let h = 1;

  // Calculate h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  // Calculate hash value of pattern and first window of text
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  // Slide the pattern over text one by one
  for (let i = 0; i <= n - m; i++) {
    // Check the hash values of current window of text and pattern
    if (p === t) {
      // If hash values match, check characters one by one
      let j;
      for (j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          break;
        }
      }

      if (j === m) {
        matches.push(i);
      }
    }

    // Calculate hash value for next window of text
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) {
        t += q;
      }
    }
  }

  return matches;
}

export function horspoolSearch(text: string, pattern: string) {
  const positions: number[] = [];
  const n = text.length;
  const m = pattern.length;
  let comparisons = 0;

  if (m === 0 || n === 0 || m > n) {
    return { name: 'Horspool Algorithm', positions, comparisons };
  }

  // Build the shift table
  const shift: Record<string, number> = {};
  for (let i = 0; i < m - 1; i++) {
    shift[pattern[i]] = m - 1 - i;
  }

  let i = 0;
  while (i <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[i + j]) {
      comparisons++;
      j--;
    }
    if (j < 0) {
      positions.push(i);
      i++;
    } else {
      comparisons++;
      const shiftVal = shift[text[i + m - 1]] || m;
      i += shiftVal;
    }
  }

  return { name: 'Horspool Algorithm', positions, comparisons };
} 