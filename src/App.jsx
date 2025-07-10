import "./App.css";
import Button from "@mui/material/Button";
import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";

function App() {
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", width: "100vw" }}
      >
        <Container maxWidth="lg">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
