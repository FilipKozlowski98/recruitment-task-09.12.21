import styled from "styled-components";

const CongratulationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  border-radius: 10px;
  background-color: #13f210;

  h1 {
    margin-bottom: 15px;
  }
`;

export const Congratulation = () => {
  return (
    <CongratulationWrapper className="congratulationWrapper hidden">
      <h1>CONGRATULATIONS !</h1>
      <h3>Your form has been successfully submitted.</h3>
    </CongratulationWrapper>
  );
};
