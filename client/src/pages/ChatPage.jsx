import React from "react";
import toast from "react-hot-toast";

const ChatPage = () => {
  const notify = () => toast.success('Successfully created!');


  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
    </div>
  );
};

export default ChatPage;
