import { existsSync, readdirSync } from "fs";
import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

interface PackageJson {
  name: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const getApps = (sources: string | string[]) => {
  if (typeof sources === "string") {
    sources = [sources];
  }
  const choices = sources.flatMap((source) => {
    return readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .filter((dirent) =>
        existsSync(`${source}/${dirent.name}/components.json`),
      )
      .map((dirent) => {
        const choice = {
          name: dirent.name,
          value: `${source}/${dirent.name}`,
        };
        return choice;
      });
  });

  return choices;
};

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("init", {
    description: "Generate a new package for the Arianne Monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@arianne/` prefix)",
      },
      {
        type: "input",
        name: "deps",
        message:
          "Enter a space separated list of dependencies you would like to install",
      },
    ],
    actions: [
      (answers) => {
        if ("name" in answers && typeof answers.name === "string") {
          if (answers.name.startsWith("@arianne/")) {
            answers.name = answers.name.replace("@arianne/", "");
          }
        }
        return "Config sanitized";
      },
      {
        type: "add",
        path: "packages/{{ name }}/eslint.config.js",
        templateFile: "templates/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/src/index.ts",
        template: "export const name = '{{ name }}';",
      },
      {
        type: "modify",
        path: "packages/{{ name }}/package.json",
        async transform(content, answers) {
          if ("deps" in answers && typeof answers.deps === "string") {
            const pkg = JSON.parse(content) as PackageJson;
            for (const dep of answers.deps.split(" ").filter(Boolean)) {
              const version = await fetch(
                `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
              )
                .then((res) => res.json())
                .then((json) => json.latest);
              if (!pkg.dependencies) pkg.dependencies = {};
              pkg.dependencies[dep] = `^${version}`;
            }
            return JSON.stringify(pkg, null, 2);
          }
          return content;
        },
      },
      async (answers) => {
        /**
         * Install deps and format everything
         */
        if ("name" in answers && typeof answers.name === "string") {
          // execSync("pnpm dlx sherif@latest --fix", {
          //   stdio: "inherit",
          // });
          execSync("pnpm i", { stdio: "inherit" });
          execSync(
            `pnpm prettier --write packages/${answers.name}/** --list-different`,
          );
          return "Package scaffolded";
        }
        return "Package not scaffolded";
      },
    ],
  });

  plop.setGenerator("shadcn/ui", {
    description: "Add new shadcn/ui component",
    prompts: [
      {
        type: "list",
        name: "source",
        choices: getApps(["apps", "packages"]),
        // choices: ["psitools", "psitools-patients", "website"],
        message: "Where do you want to add the component?",
      },
      {
        type: "input",
        name: "components",
        message:
          "Enter a space separated list of components you would like to install (skip if you want to select later)",
      },
    ],
    actions: [
      async (answers) => {
        /**
         * Run the shadcn/ui CLI to scaffold the component
         * We use the `pnpm dlx` command to run the CLI without installing it
         * globally, and we pass the `-c` flag to specify the source directory.
         */
        if ("source" in answers && typeof answers.source === "string") {
          if (
            "components" in answers &&
            typeof answers.components === "string"
          ) {
            execSync(
              `pnpm dlx shadcn@latest add -c ${answers.source} ${answers.components}`,
              {
                stdio: "inherit",
              },
            );

            return "Components scaffolded";
          }
          execSync(`pnpm dlx shadcn@latest add -c ${answers.source}`, {
            stdio: "inherit",
          });
          return "Component scaffolded";
        }
        return "Components not scaffolded";
      },
    ],
  });
}
