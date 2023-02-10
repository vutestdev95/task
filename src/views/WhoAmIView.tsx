import styled from "@emotion/styled";
import "../App.css";
import { useAuth } from "../components/AuthProvider";

const WhoAmIView = () => {
  const { user } = useAuth().state;

  const WhoAmIViewContainer = styled.div({
    display: "flex",
    padding: "20px",
  });

  const Column = styled.div({
    display: "flex",
    flexDirection: "column",
    flexBasis: "50%",
    flex: "1",
  });

  return (
    <WhoAmIViewContainer data-testid={"who-am-i-view"}>
      <Column>
        <h3>User Info</h3>
        <br />
        <div>
          <b>Name:</b> {user?.PName}
        </div>
        <div>
          <b>Email:</b> {user?.CallerEmail}
        </div>
      </Column>
      <Column>
        <h3>User JSON: </h3>
        <div style={{ overflow: "scroll", height: "600px" }}>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </Column>
    </WhoAmIViewContainer>
  );
};
export default WhoAmIView;
