import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export const Header = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container className="justify-content-center">
        <Navbar.Brand>Data Explorer</Navbar.Brand>
      </Container>
    </Navbar>
  );
};
