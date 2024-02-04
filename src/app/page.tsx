"use client";

import { Box, Columns, Container, Heading, Hero } from "react-bulma-components";
import React from "react";
import { githubLight } from "@uiw/codemirror-theme-github";

import CodeMirror from "@uiw/react-codemirror";

const defaultText = `// Write your Pkl code here

anObject {
  x = 1
  y = 2
}

output {
  renderer = new JsonRenderer {}
}
`;

export default function Home() {
  const [userInputCode, setUserInputCode] = React.useState(defaultText);
  const [evaluatedOutputCode, setEvaluatedOutputCode] = React.useState(
    "// Change the Pkl code on the left to see some output"
  );
  const onUserInputChange = React.useCallback(async (val: string) => {
    setUserInputCode(val);
    const response = await fetch("/api/pkl/evaluate", {
      method: "POST",
      body: JSON.stringify({
        pklInput: val,
      }),
    });
    setEvaluatedOutputCode((await response.json()).output);
  }, []);

  return (
    <main>
      <Hero color={"primary"}>
        <Hero.Body>
          <Container>
            <Heading>Pkl Playground</Heading>
            <Heading subtitle>By the Pkl Community</Heading>
          </Container>
        </Hero.Body>
      </Hero>

      <Container>
        <Columns>
          <Columns.Column>
            <Container>
              <Box>
                <CodeMirror
                  value={userInputCode}
                  extensions={[]}
                  theme={githubLight}
                  onChange={onUserInputChange}
                />
              </Box>
            </Container>
          </Columns.Column>
          <Columns.Column>
            <Container>
              <Box>
                <CodeMirror
                  value={evaluatedOutputCode}
                  extensions={[]}
                  theme={githubLight}
                  onChange={onUserInputChange}
                />
              </Box>
            </Container>
          </Columns.Column>
        </Columns>
      </Container>
    </main>
  );
}
