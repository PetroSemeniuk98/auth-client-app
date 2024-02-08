import React, { useEffect, useState } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { v4 as uuidv4 } from "uuid";

const CDNURL =
  "https://bzfwiihhxzlkzczmzkec.supabase.co/storage/v1/object/public/galary/";
// https://bzfwiihhxzlkzczmzkec.supabase.co/storage/v1/object/public/galary/e86a28d3-6408-4da0-8cca-d1478deed923/961f5323-1243-4d46-904d-ce2668767407?t=2024-02-08T21%3A25%3A22.946Z

const App = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);

  const signInMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert("Your Email is Failed");
    } else {
      alert("Welcom in your account");
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  };

  const getImages = async () => {
    const { data, error } = await supabase.storage
      .from("galary")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data) {
      setImages(data);
    } else {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  const uploudImage = async (e) => {
    const file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("galary")
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      alert(error.message);
    }
  };

  const deleteImage = async (imageName) => {
    const { error } = await supabase.storage
      .from("galary")
      .remove([user.id + "/" + imageName]);

    if (error) throw error;

    window.location.reload();
  };

  return (
    <Container align={"center"} container={"container-sm mt-4"}>
      {user === null ? (
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
      ) : (
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={() => signOut()}>SignOut</Button>
          <p>current user:{user.email.toLocaleUpperCase()}</p>
          <p>Use a Choose file Button</p>
          <Form.Group style={{ maxWidth: "500px" }} className="mb-3">
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => uploudImage(e)}
            />
          </Form.Group>
          <hr />
          <h2>Your Images</h2>

          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={CDNURL + user.id + "/" + image.name}
                    />
                    <Card.Body>
                      <Button
                        variant="danger"
                        onClick={() => deleteImage(image.name)}
                      >
                        Delete Image
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </Container>
  );
};

export default App;
