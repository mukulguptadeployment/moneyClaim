import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";

export default function MsgModal({ open, setOpen, content, comp }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const showModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    console.log(comp);
  }, [comp]);
  const handleOk = () => {
    setOpen(false);
    if (content == "Account Created Sucessfully Please Login to Continue") {
      router.push("/");
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Okay
          </Button>,
        ]}
      >
        {content && <p>{content}</p>}
        <p>{comp}</p>
        {comp && (
          <ul>
            <li>{comp.name}</li>
            <li>{comp.email}</li>
            <li>{comp.phoneNumber}</li>
            <li>{comp.refferalCode}</li>
          </ul>
        )}
      </Modal>
    </>
  );
}
