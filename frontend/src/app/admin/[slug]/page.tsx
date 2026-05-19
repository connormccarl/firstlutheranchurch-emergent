"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { ResourcePage } from "@connormccarl/nextos";
import { cms } from "@/cms.config";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: Props) {
  const { slug } = use(params);
  const [csrf, setCsrf] = useState<string | undefined>(undefined);

  useEffect(() => {
    const t = (window as unknown as { __NEXTOS_CSRF__?: string }).__NEXTOS_CSRF__;
    setCsrf(t);
  }, []);

  if (slug === "export") return null;
  const resource = cms.resources.find((r) => r.slug === slug);
  if (!resource) notFound();
  return <ResourcePage resource={resource!} csrfToken={csrf} />;
}
