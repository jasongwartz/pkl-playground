"use client";

import {
  Box,
  Columns,
  Container,
  Form,
  Button,
  Modal,
  Icon,
} from "react-bulma-components";
import React, { useEffect } from "react";
import { githubLight } from "@uiw/codemirror-theme-github";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { groovy } from "@codemirror/legacy-modes/mode/groovy";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { json as langJson } from "@codemirror/lang-json";
import { xml as langXml } from "@codemirror/lang-xml";
import { javascript as langJavascript } from "@codemirror/lang-javascript";

import CodeMirror from "@uiw/react-codemirror";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import copy from "copy-to-clipboard";

const defaultText = `class Bird {
  name: String
  function greet(bird: Bird): String = "Hello, \\(bird.name)!"
}

function greetPigeon(bird: Bird): String = bird.greet(pigeon)

pigeon: Bird = new {
  name = "Pigeon"
}
parrot: Bird = new {
  name = "Parrot"
}

greeting1 = pigeon.greet(parrot)
greeting2 = greetPigeon(parrot)
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

export default function Editors() {
  const [userInputCode, setUserInputCode] = React.useState(defaultText);

  const [didLoadFromShare, setDidLoadFromShare] = React.useState(false);

  const [evaluatedOutputCode, setEvaluatedOutputCode] = React.useState(
    "// Change the Pkl code on the left to see some output"
  );
  const [outputFormat, setOutputFormat] = React.useState<OutputOption>("JSON");
  const [shareLink, setShareLink] = React.useState("");
  const [shareModalOpen, setShareModalOpen] = React.useState(false);

  const params = useSearchParams();
  useEffect(() => {
    if (params.has("share") && !didLoadFromShare) {
      const id = params.get("share");
      if (id) {
        fetch("/api/share?" + new URLSearchParams({ id })).then(async (res) => {
          setUserInputCode((await res.json()).text);
          setDidLoadFromShare(true);
        });
      }
    }

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

  const onCreateShare = React.useCallback(async () => {
    const response = await fetch("/api/share", {
      method: "POST",
      body: userInputCode,
    });
    if (response.ok) {
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set("share", (await response.json()).id);

      setShareLink(shareUrl.toString());
      setShareModalOpen(true);
    }
  }, [userInputCode]);

  return (
    <Container>
      <Columns>
        <Columns.Column size="half">
          <Container>
            <Box>
              <Button onClick={onCreateShare}>
                Share&nbsp;
                <FontAwesomeIcon icon={faShare} />
              </Button>
            </Box>
            <Box>
              <CodeMirror
                value={userInputCode}
                extensions={[syntaxThemes.Pcf]}
                theme={githubLight}
                onChange={onUserInputChange}
                autoFocus={true}
                height="100%"
                style={{ height: "100%" }}
              />
            </Box>
          </Container>
        </Columns.Column>
        <Columns.Column size="half">
          <Container>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Form.Select onChange={onOutputFormatChange}>
                {outputOptions.map((opt) => (
                  <option value={opt} key={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
              <Button onClick={() => copy(evaluatedOutputCode)} style={{ marginLeft: "auto" }}>
                Copy&nbsp;
                <FontAwesomeIcon icon={faCopy} />
              </Button>
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
      <Modal show={shareModalOpen} onClose={() => setShareModalOpen(false)}>
        <Modal.Card>
          <Modal.Card.Header>
            <Modal.Card.Title>Copy share link</Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body>
            <Box onClick={() => copy(shareLink)} className="is-clickable">
              {shareLink}
              <Icon align="right">
                <FontAwesomeIcon icon={faCopy} />
              </Icon>
            </Box>
          </Modal.Card.Body>
        </Modal.Card>
      </Modal>
    </Container>
  );
}
