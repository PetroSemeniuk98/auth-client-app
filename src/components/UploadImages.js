import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import React, { useState, useEffect } from "react";
import { Col, Row, Button, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { v4 as uuidv4 } from "uuid";
import { CDNURL } from "../config";


const UploadImages = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [images, setImages] = useState([]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  };

  const getImage = async () => {
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
      getImage();
    }
  }, [user]);

  const uploadImg = async (event) => {
    const file = event.target.files[0];

    const { data, error } = await supabase.storage
      .from("galary")
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImage();
    } else {
      alert(error.message);
    }
  };

  const deleteImg = async (imgName) => {
    const { error } = await supabase.storage
      .from("galary")
      .remove(user.id + "/" + imgName);

    if (error) throw error;
    window.location.reload();
  };

  return (
    <>
      <Button variant="danger" onClick={() => signOut()} className="mt-4">
        Sign OUT
      </Button>
      <h1>Welcom User</h1>
      <Form>
        <Form.Group className="mb-5" style={{ maxWidth: "500px" }}>
          <Form.Control
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(event) => uploadImg(event)}
          />
        </Form.Group>
      </Form>
      <h1>This Your Galary</h1>
      <hr />
      <h3>Images</h3>
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
                    onClick={() => deleteImg(image.name)}
                  >
                    Delete IMG
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default UploadImages;
