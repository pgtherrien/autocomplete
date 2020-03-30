import React, { useState } from "react";
import { Button, Container, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import AutocompleteProvider from "../../utils/data";
import styles from "./App.module.css";

const provider = new AutocompleteProvider();

export default function App() {
  const [input, setInput] = useState("");
  const [candidates, setCandidates] = useState([]);

  // handleChange updates the user provided input and gathers candidates
  const handleChange = e => {
    let fragment = e.target.value;

    // if there is an input gather the candidates
    if (fragment.length > 0) {
      setCandidates(provider.getWords(fragment));
    } else {
      // otherwise reset the candidates
      setCandidates([]);
    }

    // update the state with the new input
    setInput(fragment);
  };

  // handleSubmission trains the provider with the input
  const handleSubmission = () => {
    provider.train(input);
    setInput("");
  };

  return (
    <Container>
      <div className={styles.container}>
        <Autocomplete
          className={styles.input}
          freeSolo
          options={candidates.map(candidate => {
            return `"${candidate.getWord()}" (${candidate.getConfidence()})`;
          })}
          renderInput={params => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                value: input
              }}
              onChange={handleChange}
              onKeyDown={e => e.key === "Enter" && handleSubmission()}
              placeholder="Enter text here..."
              value={input}
              variant="filled"
            />
          )}
        />
        <Button color="primary" onClick={handleSubmission} variant="contained">
          Submit
        </Button>
      </div>
    </Container>
  );
}
