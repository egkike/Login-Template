import React from "react";

const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-cyan border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default Loader;
