import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ClearTokenAndRedirect() {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
    setShouldRedirect(true);
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return null; // or a loading indicator
}

export default ClearTokenAndRedirect;
