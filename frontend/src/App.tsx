import { useEffect, useState } from "react";
import { getHello } from "./api/hello";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    getHello()
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to contact backend."));
  }, []);

  return (
    <main>
      <h1>Submission Platform</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;