import packageJson from "../../package.json";

export const information = {
  version: packageJson.version,
  name: packageJson.name,
  website: packageJson.repository.url,
};
