/***  AUTOCOMPLETEPROVIDER  ***/
export default function AutocompleteProvider() {
  this.root = new Candidate(null);
}

// getWords returns list of candidates ordered by confidence
AutocompleteProvider.prototype.getWords = function(fragment) {
  // format the fragment for lookup
  fragment = fragment.replace(/[^a-zA-Z ]/g, "").toLowerCase();
  let words = fragment.split(" ");
  let candidates = [];

  // for each word, gather the candidates
  words.forEach(word => {
    var candidate = this.root;

    // find the candidate that best matches the word
    for (var i = 0; i < word.length; i++) {
      if (candidate.children[word[i]]) {
        candidate = candidate.children[word[i]];
      } else {
        return;
      }
    }

    getAllWords(candidate, candidates);
  });

  return sortCandidates(candidates);
};

// train trains the algorithm with the provided passage
AutocompleteProvider.prototype.train = function(passage) {
  passage = passage.replace(/[^a-zA-Z ]/g, "").toLowerCase();
  let words = passage.split(" ");

  words.forEach(word => {
    let candidate = this.root;
    insertWord(candidate, word);
  });
};

/***  CANDIDATE  ***/
function Candidate(key) {
  this.children = {};
  this.confidence = 0;
  this.end = false;
  this.key = key;
  this.parent = null;
}

// getConfidence returns the confidence for the candidate
Candidate.prototype.getConfidence = function() {
  return this.confidence;
};

// getWord returns the autocomplete candidate
Candidate.prototype.getWord = function() {
  var candidate = this;
  var output = [];

  while (candidate !== null) {
    output.unshift(candidate.key);
    candidate = candidate.parent;
  }

  return output.join("");
};

/***  FUNCTIONS  ***/

// getAllWords iteratively gathers the potential candidates branching from the initial one
function getAllWords(candidate, candidates) {
  if (candidate.end) {
    candidates.push(candidate);
  }

  for (var child in candidate.children) {
    getAllWords(candidate.children[child], candidates);
  }
}

// insertWord updates the provider with an individual word fragment
function insertWord(candidate, word) {
  for (var i = 0; i < word.length; i++) {
    if (!candidate.children[word[i]]) {
      candidate.children[word[i]] = new Candidate(word[i]);
      candidate.children[word[i]].parent = candidate;
    }

    candidate = candidate.children[word[i]];

    if (i === word.length - 1) {
      candidate.end = true;
      candidate.confidence++;
    }
  }
}

// sortCandidates sorts the candidates in descending order by confidence
function sortCandidates(candidates) {
  return candidates.sort(function(a, b) {
    if (a.getConfidence() > b.getConfidence()) {
      return -1;
    } else if (a.getConfidence() < b.getConfidence()) {
      return 1;
    }
    return 0;
  });
}
