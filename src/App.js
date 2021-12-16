import styled from "styled-components";
import { Congratulation } from "./Congratulation";
import { Form } from "./Form";

const MainWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <MainWrapper>
      <Form></Form>
      <Congratulation></Congratulation>
    </MainWrapper>
  );
}

export default App;
