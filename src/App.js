import React from "react";

import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import SignInOTP from "./components/SignInOTP";

import { useUser } from "@supabase/auth-helpers-react";
import UploadImages from "./components/UploadImages";

function App() {
  const user = useUser();

  return (
    <Container align="center" container={"container-sm mt-4"}>
      {user === null ? <SignInOTP /> : <UploadImages />}
    </Container>
  );
}

export default App;
