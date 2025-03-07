import { Dispatch, SetStateAction, useState } from "react";
import { generateSalt, encryption } from "../../encryption/encryptionUtil";
import { useSocket } from "../../context/SocketContext";

export const EncryptionTextInput: React.FC<props> = ({
  user,
  isEncryptionKeySet,
  isEncryptionKeySetDiv,
  setEncryptionKeySetDiv,
  setMessages, 
  SetStoreKeyAtSession,
}) => {
  const socket = useSocket();
  const [encryptMsg, setEncryptMsg] = useState<string>("");

  const sendEncryptedMessage = async () => {
    if (isEncryptionKeySet === false) {
      alert("set encryption key");
      return;
    }
    if (encryptMsg === "") {
      alert("empty msg");
      return;
    }
    if (sessionStorage.getItem("keyforthesession")) {
      const msgsalt = generateSalt();
      const key = sessionStorage.getItem("keyforthesession");
      if (key) {
        const encryptMsgstring = await encryption(key, msgsalt, encryptMsg);
        console.log("encryption :", encryptMsg, msgsalt, encryptMsgstring);
        if (!socket) {
          alert("Connection error!");
          return;
        }
        console.log(encryptMsg);
        socket.emit("chat-message", {
          message: encryptMsgstring,
          toUser: user,
          encrypt: true,
          salt: msgsalt,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: encryptMsgstring,
            from: "me",
            encrypt: true,
            salt: msgsalt,
          },
        ]);
        setEncryptMsg("");
      }
    } else {
      alert("key is not set");
      SetStoreKeyAtSession(true);
      return;
    }
  };

  return (
    <div className="flex w-full m-3 rounded-b-md gap-3">
      <input
        className="text-white px-4 py-2 m-1 w-5/6 border rounded-3xl  border-green-400 bg-neutral-800"
        type="text"
        value={encryptMsg}
        onChange={(e) => setEncryptMsg(e.target.value)}
        placeholder="Type your message"
      />
      <div className="flex items-center gap-2 text-xs font-medium">
        <button
          className=" px-4 py-2 rounded-md bg-blue-600 text-white h-fit"
          onClick={sendEncryptedMessage}
        >
          Send
        </button>

        <button
          onClick={() => setEncryptionKeySetDiv((prev) => !prev)}
          className="bg-red-800 text-white p-2 rounded-md capitalize"
        >
          {isEncryptionKeySetDiv ? "Cancel" : "Set Key"}
        </button>
      </div>
    </div>
  );
};

interface props {
  user: string | undefined;
  isEncryptionKeySet: boolean;
  setEncryptionKeySetDiv: Dispatch<SetStateAction<boolean>>;
  isEncryptionKeySetDiv: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
  SetStoreKeyAtSession: Dispatch<SetStateAction<boolean>>;
}

interface Msg {
  text: string;
  from: string;
  encrypt: boolean;
  salt: string | null;
}
