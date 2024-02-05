import {
  Container,
  Heading,
  Hero,
  Navbar,
  Button,
} from "react-bulma-components";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  return (
    <Hero color={"primary"}>
      <Hero.Header>
        <Navbar>
          <Navbar.Menu>
            <Navbar.Container align="right">
              <Navbar.Item href="https://pkl-lang.org" target="_blank">
                <Button>
                  <FontAwesomeIcon icon={faBook} size="xl"></FontAwesomeIcon>
                </Button>
              </Navbar.Item>
              <Navbar.Item
                href="https://github.com/jasongwartz/pkl-playground"
                target="_blank"
              >
                <Button color="primary" inverted>
                  <FontAwesomeIcon icon={faGithub} size="xl" />
                </Button>
              </Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
      </Hero.Header>
      <Hero.Body>
        <Container>
          <Heading>Pkl Playground</Heading>
          <Heading subtitle>By the Pkl Community</Heading>
        </Container>
      </Hero.Body>
    </Hero>
  );
}
