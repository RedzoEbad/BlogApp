import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
      <p className="mb-4">You don’t have permission to view this page.</p>
      <Link to="/" className="underline">Go home</Link>
    </div>
  );
}
