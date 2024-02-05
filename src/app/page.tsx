"use client";

import {
  Box,
  Columns,
  Container,
  Heading,
  Hero,
  Form,
  Section,
} from "react-bulma-components";
import React, { useEffect } from "react";
import { githubLight } from "@uiw/codemirror-theme-github";
import {
  LanguageSupport,
  StreamLanguage,
  StreamParser,
} from "@codemirror/language";
import { groovy } from "@codemirror/legacy-modes/mode/groovy";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { json as langJson } from "@codemirror/lang-json";
import { xml as langXml } from "@codemirror/lang-xml";
import { javascript as langJavascript } from "@codemirror/lang-javascript";

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

const syntaxThemes: Record<
  OutputOption,
  StreamLanguage<unknown> | LanguageSupport
> = {
  JSON: langJson(),
  Jsonnet: langJavascript(), // Not perfect, but maybe close?
  Pcf: StreamLanguage.define(groovy),
  Plist: langXml(),
  Properties: StreamLanguage.define(properties),
  TextProto: StreamLanguage.define(protobuf),
  XML: langXml(),
  YAML: StreamLanguage.define(yaml),
} as const;

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

      <Section>
        <Container>
          <Columns>
            <Columns.Column size="half">
              <Container>
                <Box>
                  <CodeMirror
                    value={userInputCode}
                    extensions={[syntaxThemes.Pcf]}
                    theme={githubLight}
                    onChange={onUserInputChange}
                    autoFocus
                  />
                </Box>
              </Container>
            </Columns.Column>
            <Columns.Column size="half">
              <Container>
                <Box>
                  <Form.Select onChange={onOutputFormatChange}>
                    {outputOptions.map((opt) => (
                      <option value={opt} key={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                </Box>
                <Box>
                  <CodeMirror
                    value={evaluatedOutputCode}
                    extensions={
                      outputFormat in syntaxThemes
                        ? [syntaxThemes[outputFormat]]
                        : []
                    }
                    theme={githubLight}
                    onChange={onUserInputChange}
                    editable={false}
                  />
                </Box>
              </Container>
            </Columns.Column>
          </Columns>
        </Container>
      </Section>
    </main>
  );
}
