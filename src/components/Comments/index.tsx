import { useColorMode } from "@docusaurus/theme-common";
import Giscus from "@giscus/react";

// https://rikublock.dev/docs/tutorials/giscus-integration/
export default function Comments(): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div className="docusaurus-mt-lg">
      <Giscus
        id="comments"
        repo="gogf/gf-site"
        repoId="R_kgDONDiuow"
        category="General"
        categoryId="DIC_kwDONDiuo84Cj4QE"
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === "dark" ? "dark_tritanopia" : "light_tritanopia"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
