"use client";

import {
  Box,
  Columns,
  Container,
  Heading,
  Hero,
  Form,
} from "react-bulma-components";
import React, { useEffect } from "react";
import { githubLight } from "@uiw/codemirror-theme-github";

import CodeMirror from "@uiw/react-codemirror";

const defaultText = `// Write your Pkl code here

anObject {
  x = 1
  y = 2
}
`;

const outputOptions = [
  "JSON",
  "Jsonnet",
  "Pcf",
  "Plist",
  "Properties",
  "TextProto",
  "XML",
  "YAML",
] as const;

type OutputOption = (typeof outputOptions)[number];

export default function Home() {
  const [userInputCode, setUserInputCode] = React.useState(defaultText);
  const [evaluatedOutputCode, setEvaluatedOutputCode] = React.useState(
    "// Change the Pkl code on the left to see some output"
  );
  const [outputFormat, setOutputFormat] = React.useState<OutputOption>("JSON");

  useEffect(() => {
    const refreshPklOutput = async () => {
      const response = await fetch("/api/pkl/evaluate", {
        method: "POST",
        body: JSON.stringify({
          pklInput: userInputCode,
          outputFormat: outputFormat.toLowerCase(),
        }),
      });
      if (response.ok) {
        setEvaluatedOutputCode((await response.json()).output);
      } else {
        setEvaluatedOutputCode((await response.json()).error);
      }
    };

    refreshPklOutput();
  }, [outputFormat, userInputCode]);

  const onUserInputChange = React.useCallback(async (val: string) => {
    setUserInputCode(val);
  }, []);

  const onOutputFormatChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      setOutputFormat(event.target.value as OutputOption);
    },
    []
  );

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
                  autoFocus
                />
              </Box>
            </Container>
          </Columns.Column>
          <Columns.Column>
            <Container>
              <Box>
                <Form.Select onChange={onOutputFormatChange}>
                  {outputOptions.map((opt) => (
                    <option value={opt.toLowerCase()} key={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Select>
              </Box>
              <Box>
                <CodeMirror
                  value={evaluatedOutputCode}
                  extensions={[]}
                  theme={githubLight}
                  onChange={onUserInputChange}
                  editable={false}
                />
              </Box>
            </Container>
          </Columns.Column>
        </Columns>
      </Container>
    </main>
  );
}
