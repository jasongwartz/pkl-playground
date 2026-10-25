import {
  Container,
  Heading,
  Hero,
  Navbar,
  Button,
} from "react-bulma-components";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faBook,
  faBookAtlas,
  faBookOpen,
  faBookReader,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  return (
    <Hero color={"primary"} renderAs="section">
      <Hero.Header renderAs="header">
        <Navbar renderAs="nav">
          <Navbar.Menu>
            <Navbar.Container align="right">
              <Navbar.Item renderAs="a" href="https://pkl-lang.org" target="_blank">
                <Button renderAs="button" textColor="primary">
                  <FontAwesomeIcon icon={faBook} size="xl"></FontAwesomeIcon>
                </Button>
              </Navbar.Item>
              <Navbar.Item
                renderAs="a"
                href="https://github.com/pkl-community"
                target="_blank"
              >
                <Button renderAs="button" textColor="primary">
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    size="xl"
                  ></FontAwesomeIcon>
                </Button>
              </Navbar.Item>
              <Navbar.Item renderAs="a" href="/discord-invite" target="_blank">
                <Button renderAs="button" color="primary" inverted>
                  <FontAwesomeIcon icon={faDiscord} size="xl" />
                </Button>
              </Navbar.Item>

              <Navbar.Item
                renderAs="a"
                href="https://github.com/jasongwartz/pkl-playground"
                target="_blank"
              >
                <Button renderAs="button" color="primary" inverted>
                  <FontAwesomeIcon icon={faGithub} size="xl" />
                </Button>
              </Navbar.Item>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
      </Hero.Header>
      <Hero.Body>
        <Container>
          <Heading renderAs="h1">Pkl Playground</Heading>
          <Heading renderAs="h1" subtitle>By the Pkl Community</Heading>
        </Container>
      </Hero.Body>
    </Hero>
  );
}
