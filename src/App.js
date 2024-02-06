import { Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useState } from "react";

function App() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState("");

  const magicLinkLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });
    if (error) {
      alert("Your email is Failed!");
    } else {
      alert("Welcome to your account!");
    }
  };
  const signOut = async () => {
    const { data, error } = await supabase.auth.signOut();

    if (error) {
      alert("SignOut ERROR");
    }
  };

  console.log(email);

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <h1>Welcome ImageWall</h1>
          <Form>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Label>Email to sign supabase magic link </Form.Label>
              <Form.Control
                type="email"
                placeholder="Your Email..."
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => magicLinkLogin()}>
              Magik Link
            </Button>
          </Form>
        </>
      ) : (
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={() => signOut()}>SignOut</Button>
          <p>current user:{user.email}</p>
        </>
      )}
    </Container>
  );
}

export default App;
