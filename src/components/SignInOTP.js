import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SignInOTP = () => {
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState("");

  const signInMagicLink = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (data) {
      alert("Welcom your account!");
    } else {
      alert(error.message);
    }
  };

  return (
    <>
      <h1>Welcome ImageWall</h1>
      <Form>
        <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
          <Form.Label>Email to sign supabase magic link</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Button onClick={() => signInMagicLink()}>Magic Link</Button>
      </Form>
    </>
  );
};

export default SignInOTP;
