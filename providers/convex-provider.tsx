"use client";

import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ConvexProviderClient = ({ children }: { children: React.ReactNode }) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

export default ConvexProviderClient;
