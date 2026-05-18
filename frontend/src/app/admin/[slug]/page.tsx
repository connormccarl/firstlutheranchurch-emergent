"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ResourcePage } from "@flc/cms";
import { cms } from "@/cms.config";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: Props) {
  const { slug } = use(params);
  // Don't intercept reserved children (export already has its own page)
  if (slug === "export") return null;
  const resource = cms.resources.find((r) => r.slug === slug);
  if (!resource) notFound();
  return <ResourcePage resource={resource!} />;
}
