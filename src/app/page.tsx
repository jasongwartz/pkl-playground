"use client";

import { Section } from "react-bulma-components";
import React, { Suspense } from "react";

import Header from "@/components/header";
import Editors from "@/components/editors";

export default function Home() {
  return (
    <main>
      <Header />

      <Section size="large">
        <Suspense>
          <Editors />
        </Suspense>
      </Section>
    </main>
  );
}
