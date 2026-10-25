"use client";

import { Section } from "react-bulma-components";
import React, { Suspense } from "react";

import Header from "@/components/header";
import Editors from "@/components/editors";

export default function Home() {
  return (
    <main>
      <Header />

      <Section renderAs="section">
        <Suspense>
          <Editors />
        </Suspense>
      </Section>
    </main>
  );
}
