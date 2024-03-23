import { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  framework: "@storybook/vue3-vite",
  addons: ["@storybook/addon-essentials"],
  stories: ["../src/**/*.stories.@(js|ts)"],
};

export default config;
